import sequelize from "sequelize";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { Contributor } from "../model/Contributor";
import {
    CommitMetricsServiceQueryDataValues,
    CommitMetricsServiceResponse,
} from "../interface/CommitMetrics";
import {
    getDateInDayEnd,
    getDateInDayStart,
    getDateInServerTimeZone,
} from "../utils/date";

export default class CommitService {
    async getCommitMetricsGroupedByContributor(
        repositoryId: number,
        branchName: string,
        startedAt: Date,
        endedAt: Date
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
