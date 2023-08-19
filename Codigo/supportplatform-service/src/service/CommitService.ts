import sequelize from "sequelize";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { Contributor } from "../model/Contributor";
import { CommitMetricsServiceResponse } from "../interface/CommitMetrics";

export default class CommitService {
    async getCommitMetrics(repositoryId: number, branchName: string) {
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

        return commitCounts.map(
            (item) => item.dataValues as unknown as CommitMetricsServiceResponse
        );
    }
}
