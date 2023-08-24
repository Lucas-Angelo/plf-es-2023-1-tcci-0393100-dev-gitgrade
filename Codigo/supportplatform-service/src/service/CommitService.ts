import sequelize from "sequelize";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { Contributor } from "../model/Contributor";
import {
    CommitMetricsServiceQueryDataValues,
    CommitMetricsServiceResponse,
} from "../interface/CommitMetrics";

export default class CommitService {
    async getCommitMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string
    ) {
        const commitCounts = await Contributor.findAll({
            attributes: [
                "id",
                "githubName",
                "githubLogin",
                "githubAvatarUrl",
                [
                    sequelize.fn("COUNT", sequelize.col("commits.id")),
                    "commitCount",
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
                    ],
                },
            ],
            group: ["Contributor.id"],
        });

        const dataValues = commitCounts.map(
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
}
