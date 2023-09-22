import sequelize from "sequelize";
import { Contributor } from "../model/Contributor";
import { Commit } from "../model/Commit";
import { Branch } from "../model/Branch";
import { File } from "../model/File";
import {
    FileChangeMetricsServiceQueryDataValues,
    FileChangeMetricsServiceResponse,
} from "../interface/FileMetrics";
import {
    getDateInDayEnd,
    getDateInDayStart,
    getDateInServerTimeZone,
} from "../utils/date";
import { FileTypeMetricsDTO } from "@gitgrade/dtos";

export default class FileService {
    async getFileChangeMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date
    ) {
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
                            [sequelize.Op.between]: [
                                getDateInDayStart(
                                    getDateInServerTimeZone(startedAt)
                                ),
                                getDateInDayEnd(
                                    getDateInServerTimeZone(endedAt)
                                ),
                            ],
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
        });

        const dataValues = changesCounts.map(
            (item) =>
                item.dataValues as unknown as FileChangeMetricsServiceQueryDataValues
        );

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
            include: [
                {
                    model: Commit,
                    required: true,
                    as: "commit",
                    where: {
                        committedDate: {
                            [sequelize.Op.between]: [
                                getDateInDayStart(
                                    getDateInServerTimeZone(startedAt)
                                ),
                                getDateInDayEnd(
                                    getDateInServerTimeZone(endedAt)
                                ),
                            ],
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
        endedAt: Date
    ) {
        const fileChanges = await File.findAll({
            attributes: ["extension", "path", "commitId"],
            include: [
                {
                    model: Commit,
                    required: true,
                    as: "commit",
                    attributes: ["id"],
                    where: {
                        committedDate: {
                            [sequelize.Op.between]: [
                                getDateInDayStart(
                                    getDateInServerTimeZone(startedAt)
                                ),
                                getDateInDayEnd(
                                    getDateInServerTimeZone(endedAt)
                                ),
                            ],
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
                            required: true,
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
            number,
            Map<string, number>
        >();
        const mapLoadedFilesToContributorsSet = new Map<string, Set<number>>();
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
                        new Set([contributor.id])
                    );
                }

                if (!fileContributorSet?.has(contributor.id)) {
                    let contributorMap =
                        mapContributorToMapExtensionToCount.get(contributor.id);
                    if (!contributorMap) {
                        contributorMap = new Map<string, number>();
                        mapContributorToMapExtensionToCount.set(
                            contributor.id,
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
            ).reduce((finalArray, [id, contributorMap]) => {
                const contributor = fileChanges.find(
                    (commitAndStuff) =>
                        commitAndStuff.commit.contributor.id === id
                )?.commit.contributor;
                if (contributor) {
                    finalArray.push({
                        contributor: {
                            id: Number(contributor.id),
                            githubName: contributor.githubName,
                            githubLogin: contributor.githubLogin,
                            githubAvatarUrl: contributor.githubAvatarUrl,
                        },
                        fileTypes: mapToArrayOfObjects(contributorMap),
                    });
                }

                return finalArray;
            }, [] as Array<FileTypeMetricsDTO["perContributor"][number]>),
        };

        return serviceResponse;
    }
}
