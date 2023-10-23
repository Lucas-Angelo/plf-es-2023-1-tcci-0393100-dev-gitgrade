import sequelize, { Sequelize, WhereOptions } from "sequelize";
import { Contributor } from "../model/Contributor";
import { Commit } from "../model/Commit";
import { Branch } from "../model/Branch";
import { File } from "../model/File";
import {
    FileChangeMetricsServiceQueryDataValues,
    FileChangeMetricsServiceResponse,
} from "../interface/FileMetrics";
import {
    FileSearchDTO,
    FileTypeMetricsDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { getContributorWhere } from "../utils/contributorFilter";
import logger from "../config/LogConfig";
import { sequelizePagination } from "../utils/pagination";
import AppError from "../error/AppError";
import {
    FileFindAllServiceResponse,
    FileWhereClauseType,
} from "../interface/File";
import { Op } from "sequelize";
import RepositoryService from "./RepositoryService";

export default class FileService {
    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
    }

    async getFileChangeMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date,
        contributors: Array<string> | undefined,
        filterWithNoContributor: boolean | undefined
    ) {
        const dataValues: Array<FileChangeMetricsServiceQueryDataValues> = [];

        if (
            (contributors?.length && contributors.length > 0) ||
            !filterWithNoContributor
        ) {
            const contributorWhere = contributors
                ? { githubLogin: contributors }
                : {};
            const changesCounts = await Contributor.findAll({
                attributes: [
                    "id",
                    "githubName",
                    "githubLogin",
                    "githubAvatarUrl",
                    [
                        sequelize.fn(
                            "SUM",
                            sequelize.col("commits.files.additions")
                        ),
                        "additionSum",
                    ],
                    [
                        sequelize.fn(
                            "SUM",
                            sequelize.col("commits.files.deletions")
                        ),
                        "deletionsSum",
                    ],
                    [
                        sequelize.fn(
                            "COUNT",
                            sequelize.fn(
                                "DISTINCT",
                                sequelize.col("commits.files.path")
                            )
                        ),
                        "fileCount",
                    ],
                ],
                include: [
                    {
                        model: Commit,
                        required: true,
                        as: "commits",
                        attributes: [],
                        where: {
                            committedDate: {
                                [sequelize.Op.between]: [startedAt, endedAt],
                            },
                        },
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
                                model: File,
                                as: "files",
                                attributes: [],
                                required: true,
                            },
                        ],
                    },
                ],
                group: ["Contributor.id"],
                where: contributorWhere,
            });

            dataValues.push(
                ...changesCounts.map(
                    (item) =>
                        item.dataValues as unknown as FileChangeMetricsServiceQueryDataValues
                )
            );
        }

        if (
            !contributors ||
            contributors.length === 0 ||
            filterWithNoContributor
        ) {
            const noContributorChangesCount = await File.findAll({
                raw: true,
                attributes: [
                    [
                        sequelize.fn("SUM", sequelize.col("additions")),
                        "additionSum",
                    ],
                    [
                        sequelize.fn("SUM", sequelize.col("deletions")),
                        "deletionsSum",
                    ],
                    [
                        sequelize.fn(
                            "COUNT",
                            sequelize.fn("DISTINCT", sequelize.col("path"))
                        ),
                        "fileCount",
                    ],
                ],
                include: [
                    {
                        model: Commit,
                        required: true,
                        as: "commit",
                        attributes: [],
                        where: {
                            committedDate: {
                                [sequelize.Op.between]: [startedAt, endedAt],
                            },
                            contributorId: null,
                        },
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
                        ],
                    },
                ],
            });

            const noContributorDataValues =
                noContributorChangesCount as unknown as Omit<
                    FileChangeMetricsServiceQueryDataValues,
                    "contributor"
                >[];

            if (
                noContributorDataValues.length > 0 &&
                (Number(noContributorDataValues[0].fileCount) > 0 ||
                    Number(noContributorDataValues[0].additionSum) > 0 ||
                    Number(noContributorDataValues[0].deletionsSum) > 0)
            ) {
                dataValues.push(...noContributorDataValues);
            }
        }

        const { totalAdditions, totalDeletions } = dataValues.reduce(
            (sumObj, item) => ({
                totalAdditions:
                    sumObj.totalAdditions + Number(item.additionSum),
                totalDeletions:
                    sumObj.totalDeletions + Number(item.deletionsSum),
            }),
            { totalAdditions: 0, totalDeletions: 0 }
        );

        const countAllResponse = await File.count({
            group: ["path"],
            where: getContributorWhere(contributors, filterWithNoContributor, {
                contributorIdFilterKey: "$commit.contributor_id$",
                contributorLoginFilterKey: "$commit.contributor.github_login$",
            }),
            include: [
                {
                    model: Commit,
                    required: true,
                    as: "commit",
                    where: {
                        committedDate: {
                            [sequelize.Op.between]: [startedAt, endedAt],
                        },
                    },
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
                        },
                    ],
                },
            ],
        });

        const response: FileChangeMetricsServiceResponse = {
            totalAdditions,
            totalDeletions,
            results: dataValues,
            fileCount: countAllResponse.length,
        };

        return response;
    }

    async getFileTypeMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date,
        contributors: Array<string> | undefined,
        filterWithNoContributor: boolean | undefined
    ) {
        const fileChanges = await File.findAll({
            attributes: ["extension", "path", "commitId"],
            where: getContributorWhere(contributors, filterWithNoContributor, {
                contributorIdFilterKey: "$commit.contributor_id$",
                contributorLoginFilterKey: "$commit.contributor.github_login$",
            }),
            include: [
                {
                    model: Commit,
                    required: true,
                    as: "commit",
                    attributes: ["id"],
                    where: {
                        committedDate: {
                            [sequelize.Op.between]: [startedAt, endedAt],
                        },
                    },
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
                            required: false,
                            as: "contributor",
                            attributes: [
                                "id",
                                "githubName",
                                "githubLogin",
                                "githubAvatarUrl",
                            ],
                        },
                    ],
                },
            ],
        });

        const mapExtensionToCount = new Map<string, number>();
        const mapContributorToMapExtensionToCount = new Map<
            number | undefined,
            Map<string, number>
        >();
        const mapLoadedFilesToContributorsSet = new Map<
            string,
            Set<number | undefined>
        >();
        for (const fileAndStuff of fileChanges) {
            // agrupar por tipo de arquivo
            // contar quantos de cada tipo de arquivo
            // somar a contagem em uma variável geral e em uma variável do contributor
            const file = fileAndStuff;

            const contributor = file.commit.contributor;
            const extensionKey = file.extension;

            if (extensionKey) {
                const fileContributorSet = mapLoadedFilesToContributorsSet.get(
                    file.path
                );

                if (!fileContributorSet) {
                    const value = mapExtensionToCount.get(extensionKey);
                    if (value) {
                        mapExtensionToCount.set(extensionKey, value + 1);
                    } else {
                        mapExtensionToCount.set(extensionKey, 1);
                    }

                    mapLoadedFilesToContributorsSet.set(
                        file.path,
                        new Set([contributor?.id])
                    );
                }

                if (!fileContributorSet?.has(contributor?.id)) {
                    let contributorMap =
                        mapContributorToMapExtensionToCount.get(
                            contributor?.id
                        );
                    if (!contributorMap) {
                        contributorMap = new Map<string, number>();
                        mapContributorToMapExtensionToCount.set(
                            contributor?.id,
                            contributorMap
                        );
                    }

                    if (contributorMap) {
                        const value = contributorMap.get(extensionKey);
                        if (value) {
                            contributorMap.set(extensionKey, value + 1);
                        } else {
                            contributorMap.set(extensionKey, 1);
                        }
                    }
                }
            }
        }

        function mapToArrayOfObjects(map: Map<string, number>) {
            return Array.from(map.entries()).map(([extension, count]) => {
                return {
                    extension,
                    count: Number(count),
                };
            });
        }

        const serviceResponse: FileTypeMetricsDTO = {
            general: mapToArrayOfObjects(mapExtensionToCount),
            perContributor: Array.from(
                mapContributorToMapExtensionToCount.entries()
            ).reduce(
                (finalArray, [id, contributorMap]) => {
                    const contributor = fileChanges.find(
                        (commitAndStuff) =>
                            commitAndStuff.commit.contributor?.id === id
                    )?.commit.contributor;
                    finalArray.push({
                        contributor: contributor
                            ? {
                                  id: Number(contributor.id),
                                  githubName: contributor.githubName,
                                  githubLogin: contributor.githubLogin,
                                  githubAvatarUrl: contributor.githubAvatarUrl,
                              }
                            : undefined,
                        fileTypes: mapToArrayOfObjects(contributorMap),
                    });

                    return finalArray;
                },
                [] as Array<FileTypeMetricsDTO["perContributor"][number]>
            ),
        };

        return serviceResponse;
    }

    /**
     * Find all Commits based on given filters.
     */
    async findAll(
        search: FileSearchDTO
    ): Promise<PaginationResponseDTO<FileFindAllServiceResponse>> {
        try {
            const repository = await this.repositoryService.findById(
                search.repositoryId
            );
            if (!repository) {
                throw new AppError("Repository not found", 404);
            }
            const deafultBranch = repository.defaultBranch;
            if (!search.branchName) {
                search.branchName = deafultBranch;
            }

            logger.info("Searching for all commits");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await File.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: whereClause,
                group: ["path"],
                order: [["path", "ASC"]],
                attributes: [
                    "path",
                    "extension",
                    [
                        sequelize.fn("SUM", sequelize.col("additions")),
                        "additions",
                    ],
                    [
                        sequelize.fn("SUM", sequelize.col("deletions")),
                        "deletions",
                    ],
                ],

                include: [
                    {
                        model: Commit,
                        as: "commit",
                        attributes: ["committedDate"],
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
                    },
                ],
            });

            logger.info("Successfully found all files: ", {
                count: count.length,
            });

            const filePathContributorSetMap = new Map<
                string,
                Set<number | null>
            >();
            const contributorIdContributorMap = new Map<
                number,
                Contributor | null
            >();

            logger.info("Should get contributors: ", {
                shouldGetContributors: search.shouldGetContributors,
            });

            if (search.shouldGetContributors) {
                // Consulta para obter contribuidores agrupados por arquivo (buscando pelos commits)
                const commitsAndFiles = await Commit.findAll({
                    attributes: [],
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
                        {
                            model: File,
                            as: "files",
                            attributes: ["path"],
                            required: true,
                            where: {
                                path: {
                                    [Op.in]: rows.map((file) => file.path),
                                },
                            },
                        },
                    ],
                    where: this._constructWhereClauseForGroupedCommitSearch(
                        search
                    ),
                });

                logger.info("Successfully found all files' commits: ", {
                    count: commitsAndFiles.length,
                });

                commitsAndFiles.forEach((commitAndFiles) => {
                    const contributor = commitAndFiles.contributor;
                    if (contributor) {
                        contributorIdContributorMap.set(
                            contributor.id,
                            contributor
                        );
                    }
                    commitAndFiles.files.forEach((file) => {
                        const fileContributors = filePathContributorSetMap.get(
                            file.path
                        );
                        if (fileContributors) {
                            fileContributors.add(contributor?.id || null);
                        } else {
                            filePathContributorSetMap.set(
                                file.path,
                                new Set([contributor?.id || null])
                            );
                        }
                    });
                });

                logger.info(
                    "Successfully processed : filePathContributorSetMap and contributorIdContributorMap",
                    {
                        contributorIdContributorMapSize:
                            contributorIdContributorMap.size,
                        filePathContributorSetMapSize:
                            filePathContributorSetMap.size,
                    }
                );
            }

            const fileGroupedWithContributors = rows.map((file) => {
                const fileContributors = filePathContributorSetMap.get(
                    file.path
                );
                return {
                    path: file.path,
                    extension: file.extension,
                    additions: file.additions,
                    deletions: file.deletions,
                    contributors: fileContributors
                        ? Array.from(fileContributors).map((contributorId) => {
                              return contributorId
                                  ? contributorIdContributorMap.get(
                                        contributorId
                                    )
                                  : null;
                          })
                        : [],
                };
            });

            logger.info("Successfully grouped files to contributors: ", {
                count: fileGroupedWithContributors.length,
            });

            return {
                results: fileGroupedWithContributors,
                totalPages: Math.ceil(count.length / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all files:", { error });
            throw new AppError("Failed to find all files", 500, error);
        }
    }

    /**
     * Construct where clause for sequelize query (commit)
     */
    private _constructWhereClauseForGroupedCommitSearch(filter: FileSearchDTO) {
        const whereConditions: Array<WhereOptions> = [];

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
                        contributorIdFilterKey: "$contributor_id$",
                        contributorLoginFilterKey: "$contributor.github_login$",
                    }
                )
            );
        }

        logger.info(
            "Constructed where conditions for grouped commit search: ",
            { whereConditions }
        );

        const whereClause = {
            [Op.and]: whereConditions,
        };

        return whereClause;
    }

    /**
     * Construct where clause for sequelize query.
     */
    private _constructWhereClause(filter: FileSearchDTO): FileWhereClauseType {
        const whereConditions: FileWhereClauseType[typeof Op.and] = [];

        if (filter.startedAt && filter.endedAt) {
            whereConditions.push({
                "$commit.committed_date$": {
                    [Op.between]: [filter.startedAt, filter.endedAt],
                },
            });
        } else if (filter.startedAt) {
            whereConditions.push({
                "$commit.committed_date$": {
                    [Op.gte]: filter.startedAt,
                },
            });
        } else if (filter.endedAt) {
            whereConditions.push({
                "$commit.committed_date$": {
                    [Op.lte]: filter.endedAt,
                },
            });
        }

        if (filter.repositoryId) {
            whereConditions.push({
                ["$commit.branch.repository_id$"]: filter.repositoryId,
            });
        }

        if (filter.branchName) {
            whereConditions.push({
                ["$commit.branch.name$"]: filter.branchName,
            });
        }

        if (filter.contributor?.length || filter.filterWithNoContributor) {
            whereConditions.push(
                getContributorWhere(
                    filter.contributor,
                    filter.filterWithNoContributor,
                    {
                        contributorIdFilterKey: "$commit.contributor_id$",
                        contributorLoginFilterKey:
                            "$commit.contributor.github_login$",
                    }
                )
            );
        }

        if (filter.path) {
            whereConditions.push(
                Sequelize.where(
                    Sequelize.fn("lower", Sequelize.col("path")),
                    Op.like,
                    `%${filter.path.toLowerCase()}%`
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
