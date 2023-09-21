import sequelize from "sequelize";
import { Contributor } from "../model/Contributor";
import { Issue } from "../model/Issue";
import {
    getDateInDayEnd,
    getDateInDayStart,
    getDateInServerTimeZone,
} from "../utils/date";
import { Repository } from "../model/Repository";
import { IssueMetricsDTO } from "@gitgrade/dtos";

export default class IssueService {
    async getIssueMetricsGroupedByContributor(
        repositoryId: number,
        startedAt: Date,
        endedAt: Date
    ) {
        const dateWhereClause = {
            [sequelize.Op.between]: [
                getDateInDayStart(getDateInServerTimeZone(startedAt)),
                getDateInDayEnd(getDateInServerTimeZone(endedAt)),
            ],
        };
        const issuesWithAuthorContributor = await Issue.findAll({
            attributes: ["githubCreatedAt", "githubClosedAt", "id"],
            where: {
                [sequelize.Op.or]: [
                    {
                        githubCreatedAt: dateWhereClause,
                    },
                    {
                        githubClosedAt: dateWhereClause,
                    },
                ],
            },
            include: [
                {
                    model: Repository,
                    required: true,
                    where: {
                        id: repositoryId,
                    },
                    as: "repository",
                    attributes: [],
                },
                {
                    model: Contributor,
                    as: "author",
                    required: true,
                    attributes: [
                        "id",
                        "githubName",
                        "githubLogin",
                        "githubAvatarUrl",
                    ],
                },
            ],
        });

        const issuesWithAssigneeContributor = await Issue.findAll({
            attributes: ["githubCreatedAt", "githubClosedAt", "id"],
            where: {
                [sequelize.Op.or]: [
                    {
                        githubCreatedAt: dateWhereClause,
                    },
                    {
                        githubClosedAt: dateWhereClause,
                    },
                ],
            },
            include: [
                {
                    model: Repository,
                    required: true,
                    where: {
                        id: repositoryId,
                    },
                    as: "repository",
                    attributes: [],
                },
                {
                    model: Contributor,
                    as: "assignees",
                    attributes: [
                        "id",
                        "githubName",
                        "githubLogin",
                        "githubAvatarUrl",
                    ],
                },
            ],
        });

        const contributorsIssueDataMap = new Map<
            number,
            {
                contributor: {
                    id: number;
                    githubName: string | null;
                    githubLogin: string;
                    githubAvatarUrl: string | null;
                };
                assignedIssuesCount: number;
                authoredIssuesCount: number;
            }
        >();
        let issuesOpennedCount = 0;
        let issuesClosedCount = 0;
        const computedIssues = new Set<number>();
        for (const issueWithAuthor of issuesWithAuthorContributor) {
            if (!computedIssues.has(issueWithAuthor.id)) {
                if (
                    issueWithAuthor.githubCreatedAt >= startedAt &&
                    issueWithAuthor.githubCreatedAt <= endedAt
                ) {
                    issuesOpennedCount += 1;
                }

                if (
                    issueWithAuthor.githubClosedAt &&
                    issueWithAuthor.githubClosedAt >= startedAt &&
                    issueWithAuthor.githubClosedAt <= endedAt
                ) {
                    issuesClosedCount += 1;
                }

                computedIssues.add(issueWithAuthor.id);
            }

            const author = issueWithAuthor.author;
            const contributorIssueData = contributorsIssueDataMap.get(
                author.id
            );
            if (!contributorIssueData) {
                contributorsIssueDataMap.set(author.id, {
                    contributor: {
                        id: Number(author.id),
                        githubName: author.githubName,
                        githubLogin: author.githubLogin,
                        githubAvatarUrl: author.githubAvatarUrl,
                    },
                    assignedIssuesCount: 0,
                    authoredIssuesCount: 1,
                });
            } else {
                contributorIssueData.authoredIssuesCount += 1;
                contributorsIssueDataMap.set(author.id, contributorIssueData);
            }
        }

        for (const issueWithAssignee of issuesWithAssigneeContributor) {
            if (!computedIssues.has(issueWithAssignee.id)) {
                if (
                    issueWithAssignee.githubCreatedAt >= startedAt &&
                    issueWithAssignee.githubCreatedAt <= endedAt
                ) {
                    issuesOpennedCount += 1;
                }

                if (
                    issueWithAssignee.githubClosedAt &&
                    issueWithAssignee.githubClosedAt >= startedAt &&
                    issueWithAssignee.githubClosedAt <= endedAt
                ) {
                    issuesClosedCount += 1;
                }

                computedIssues.add(issueWithAssignee.id);
            }

            const assignees = issueWithAssignee.assignees;
            for (const assignee of assignees) {
                const contributorIssueData = contributorsIssueDataMap.get(
                    assignee.id
                );
                if (!contributorIssueData) {
                    contributorsIssueDataMap.set(assignee.id, {
                        contributor: {
                            id: Number(assignee.id),
                            githubName: assignee.githubName,
                            githubLogin: assignee.githubLogin,
                            githubAvatarUrl: assignee.githubAvatarUrl,
                        },
                        assignedIssuesCount: 1,
                        authoredIssuesCount: 0,
                    });
                } else {
                    contributorIssueData.assignedIssuesCount += 1;
                    contributorsIssueDataMap.set(
                        assignee.id,
                        contributorIssueData
                    );
                }
            }
        }

        const issueDataPerContributor = Array.from(
            contributorsIssueDataMap.values()
        );

        return {
            issueDataPerContributor,
            issuesOpennedCount,
            issuesClosedCount,
        } as IssueMetricsDTO;
    }
}
