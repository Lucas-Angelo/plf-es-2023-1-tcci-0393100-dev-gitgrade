import sequelize, { Sequelize } from "sequelize";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { Contributor } from "../model/Contributor";
import {
    CommitMetricsServiceQueryDataValues,
    CommitMetricsServiceResponse,
    CommitQualityMetricsServiceQueryDataValues,
    CommitQualityMetricsServiceResponse,
} from "../interface/CommitMetrics";
import { Op } from "sequelize";
import { getContributorWhere } from "../utils/contributorFilter";
import { CommitSearchDTO, PaginationResponseDTO } from "@gitgrade/dtos";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { CommitWhereClauseType } from "../interface/Commit";
import { sequelizePagination } from "../utils/pagination";

export default class CommitService {
    async getCommitMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date,
        contributors: Array<string> | undefined,
        filterWithNoContributor: boolean | undefined
    ) {
        const contributorWhere = getContributorWhere(
            contributors,
            filterWithNoContributor,
            {
                contributorLoginFilterKey: "$contributor.github_login$",
                contributorIdFilterKey: "contributorId",
            }
        );

        const commitCountss = await Commit.findAll({
            attributes: [
                "contributorId",
                [
                    sequelize.fn("COUNT", sequelize.col("Commit.id")),
                    "commitCount",
                ],
            ],
            include: [
                {
                    model: Branch,
                    where: {
                        repositoryId,
                        name: branchName,
                    },
                    as: "branch",
                    attributes: [],
                },
                {
                    model: Contributor,
                    as: "contributor",
                    attributes: [
                        "id",
                        "githubName",
                        "githubLogin",
                        "githubAvatarUrl",
                    ],
                },
            ],
            where: {
                committedDate: {
                    [sequelize.Op.between]: [startedAt, endedAt],
                },
                ...contributorWhere,
            },
            group: ["contributorId"],
        });

        const dataValues = commitCountss.map(
            (item) =>
                item.dataValues as unknown as CommitMetricsServiceQueryDataValues
        );

        const response: CommitMetricsServiceResponse = {
            totalCommitCount: dataValues.reduce(
                (sum, item) => sum + Number(item.commitCount),
                0
            ),
            results: dataValues,
        };
        return response;
    }

    async getCommitQualityGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date,
        contributors: Array<string> | undefined,
        filterWithNoContributor: boolean | undefined
    ) {
        const qualityLevels = [
            {
                level: 0,
                operator: "<",
                barrier: 10,
            },
            {
                level: 1,
                operator: "<",
                barrier: 20,
            },
            {
                level: 2,
                operator: "<",
                barrier: 40,
            },
            {
                level: 3,
                operator: "<=",
                barrier: 100,
            },
            {
                level: 4,
                operator: ">",
                barrier: 100,
            },
        ];
        const contributorWhere = getContributorWhere(
            contributors,
            filterWithNoContributor,
            {
                contributorLoginFilterKey: "$contributor.github_login$",
                contributorIdFilterKey: "contributorId",
            }
        );

        const firstLineLengthSequelizeLiteral =
            "LENGTH(SUBSTRING_INDEX(`Commit`.`message`, '\\n', 1))";
        const qualityLevelSequelizeFn = sequelize.fn(
            "IF",
            sequelize.literal(
                `${firstLineLengthSequelizeLiteral} < ${qualityLevels[0].barrier}`
            ),
            qualityLevels[0].level,
            sequelize.fn(
                "IF",
                sequelize.literal(
                    `${firstLineLengthSequelizeLiteral} < ${qualityLevels[1].barrier}`
                ),
                qualityLevels[1].level,
                sequelize.fn(
                    "IF",
                    sequelize.literal(
                        `${firstLineLengthSequelizeLiteral} < ${qualityLevels[2].barrier}`
                    ),
                    qualityLevels[2].level,
                    sequelize.fn(
                        "IF",
                        sequelize.literal(
                            `${firstLineLengthSequelizeLiteral} <= ${qualityLevels[3].barrier}`
                        ),
                        qualityLevels[3].level,
                        qualityLevels[4].level
                    )
                )
            )
        );
        const commitQualityCounts = await Commit.findAll({
            where: {
                message: {
                    [Op.and]: [
                        {
                            [Op.notLike]: "Merge branch %",
                        },
                        {
                            [Op.notLike]: "Merge remote-tracking branch %",
                        },
                        {
                            [Op.notLike]: "Merge pull request #%",
                        },
                    ],
                },
                committedDate: {
                    [sequelize.Op.between]: [startedAt, endedAt],
                },
                ...contributorWhere,
            },

            attributes: [
                [qualityLevelSequelizeFn, "qualityLevel"],
                [
                    sequelize.fn("COUNT", qualityLevelSequelizeFn),
                    "qualityLevelCount",
                ],
            ],

            include: [
                {
                    model: Branch,
                    where: {
                        repositoryId,
                        name: branchName,
                    },
                    as: "branch",
                    attributes: [],
                },
                {
                    model: Contributor,
                    as: "contributor",
                    required: false,
                    attributes: [
                        "id",
                        "githubName",
                        "githubLogin",
                        "githubAvatarUrl",
                    ],
                },
            ],

            group: ["qualityLevel", "contributor.id"],
        });

        const dataValues = commitQualityCounts.map(
            (item) =>
                item.dataValues as unknown as CommitQualityMetricsServiceQueryDataValues
        );

        const response: CommitQualityMetricsServiceResponse = {
            generalCommitQualityLevel: qualityLevels.map((qualityLevel) => {
                const qualityLevelCount = dataValues.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.qualityLevelCount) *
                            (item.qualityLevel === qualityLevel.level ? 1 : 0),
                    0
                );
                return {
                    qualityLevel: qualityLevel.level,
                    qualityLevelCount,
                };
            }),
            results: dataValues,
        };

        return response;
    }

    /**
     * Find all Commits based on given filters.
     */
    async findAll(
        search: CommitSearchDTO
    ): Promise<PaginationResponseDTO<Commit>> {
        try {
            logger.info("Searching for all commits");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await Commit.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: whereClause,
                include: [
                    {
                        model: Branch,
                        as: "branch",
                        attributes: ["name", "id"],
                    },
                    {
                        model: Contributor,
                        as: "contributor",
                        attributes: [
                            "id",
                            "githubName",
                            "githubLogin",
                            "githubAvatarUrl",
                            "githubEmail",
                        ],
                    },
                ],
            });

            logger.info("Successfully found all commits: ", {
                count,
            });

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all commits:", { error });
            throw new AppError("Failed to find all commits", 500, error);
        }
    }

    /**
     * Construct where clause for sequelize query.
     */
    private _constructWhereClause(
        filter: CommitSearchDTO
    ): CommitWhereClauseType {
        const whereConditions: CommitWhereClauseType[typeof Op.and] = [];

        if (filter.startedAt && filter.endedAt) {
            whereConditions.push({
                committedDate: {
                    [Op.between]: [filter.startedAt, filter.endedAt],
                },
            });
        } else if (filter.startedAt) {
            whereConditions.push({
                committedDate: {
                    [Op.gte]: filter.startedAt,
                },
            });
        } else if (filter.endedAt) {
            whereConditions.push({
                committedDate: {
                    [Op.lte]: filter.endedAt,
                },
            });
        }

        if (filter.repositoryId) {
            whereConditions.push({
                ["$branch.repository_id$"]: filter.repositoryId,
            });
        }

        if (filter.branchName) {
            whereConditions.push({
                ["$branch.name$"]: filter.branchName,
            });
        }

        if (filter.contributor?.length || filter.filterWithNoContributor) {
            whereConditions.push(
                getContributorWhere(
                    filter.contributor,
                    filter.filterWithNoContributor,
                    {
                        contributorIdFilterKey: "contributorId",
                        contributorLoginFilterKey: "$contributor.github_login$",
                    }
                )
            );
        }

        if (filter.message) {
            whereConditions.push(
                Sequelize.where(
                    Sequelize.fn("lower", Sequelize.col("message")),
                    Op.like,
                    `%${filter.message.toLowerCase()}%`
                )
            );
        }

        logger.info("Constructed where conditions: ", { whereConditions });

        const whereClause = {
            [Op.and]: whereConditions,
        };
        return whereClause;
    }
}
