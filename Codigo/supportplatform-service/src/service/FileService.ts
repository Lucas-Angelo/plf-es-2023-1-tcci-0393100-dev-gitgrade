import sequelize from "sequelize";
import { Contributor } from "../model/Contributor";
import { Commit } from "../model/Commit";
import { Branch } from "../model/Branch";
import { File } from "../model/File";
import {
    FileChangeMetricsServiceQueryDataValues,
    FileChangeMetricsServiceResponse,
} from "../interface/FileMetrics";

export default class FileService {
    async getChangesMetrics(repositoryId: number, branchName: string) {
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
}
