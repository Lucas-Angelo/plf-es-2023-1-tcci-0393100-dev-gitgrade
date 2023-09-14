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

        const response: FileChangeMetricsServiceResponse = {
            totalAdditions,
            totalDeletions,
            results: dataValues,
        };

        return response;
    }

    async getFileTypeMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date
    ) {
        const changesCounts = await Commit.findAll({
            attributes: [],
            where: {
                committedDate: {
                    [sequelize.Op.between]: [
                        getDateInDayStart(getDateInServerTimeZone(startedAt)),
                        getDateInDayEnd(getDateInServerTimeZone(endedAt)),
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
                    required: true,
                    as: "files",
                    attributes: ["extension"],
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
            group: ["files.path", "contributor.id"],
        });

        const mapExtensionToCount = new Map<string, number>();
        const mapContributorToMapExtensionToCount = new Map<
            number,
            Map<string, number>
        >();

        for (const commitAndStuff of changesCounts) {
            // agrupar por tipo de arquivo
            // contar quantos de cada tipo de arquivo
            // somar a contagem em uma variável geral e em uma variável do contributor
            const file = commitAndStuff.files[0];
            const contributor = commitAndStuff.contributor;
            const key = file.extension;

            if (key) {
                const value = mapExtensionToCount.get(key);
                if (value) {
                    mapExtensionToCount.set(key, value + 1);
                } else {
                    mapExtensionToCount.set(key, 1);
                }

                let contributorMap = mapContributorToMapExtensionToCount.get(
                    contributor.id
                );
                if (!contributorMap) {
                    contributorMap = new Map<string, number>();
                    mapContributorToMapExtensionToCount.set(
                        contributor.id,
                        contributorMap
                    );
                }

                if (contributorMap) {
                    const value = contributorMap.get(key);
                    if (value) {
                        contributorMap.set(key, value + 1);
                    } else {
                        contributorMap.set(key, 1);
                    }
                }
            }
        }

        function mapToArrayOfObjects(map: Map<string, number>) {
            return Array.from(map.entries()).map(([extension, count]) => {
                return {
                    extension,
                    count,
                };
            });
        }

        const serviceResponse: FileTypeMetricsDTO = {
            general: mapToArrayOfObjects(mapExtensionToCount),
            perContributor: Array.from(
                mapContributorToMapExtensionToCount.entries()
            ).reduce((finalArray, [id, contributorMap]) => {
                const contributor = changesCounts.find(
                    (commitAndStuff) => commitAndStuff.contributor.id === id
                )?.contributor;
                if (contributor) {
                    finalArray.push({
                        contributor,
                        fileTypes: mapToArrayOfObjects(contributorMap),
                    });
                }

                return finalArray;
            }, [] as Array<FileTypeMetricsDTO["perContributor"][number]>),
        };

        return serviceResponse;
    }
}
