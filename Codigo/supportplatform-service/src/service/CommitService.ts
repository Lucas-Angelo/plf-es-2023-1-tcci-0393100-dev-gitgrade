import sequelize from "sequelize";
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
}
