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
import { getContributorWhere } from "../utils/contributorFilter";

export default class IssueService {
    async getIssueMetricsGroupedByContributor(
        repositoryId: number,
        startedAt: Date,
        endedAt: Date,
        contributors: Array<string> | undefined,
        filterWithNoContributor: boolean | undefined
    ) {
        const startedAtDayStart = getDateInDayStart(
            getDateInServerTimeZone(startedAt)
        );
        const endedAtDayEnd = getDateInDayEnd(getDateInServerTimeZone(endedAt));
        const dateWhereClause = {
            [sequelize.Op.between]: [
                getDateInDayStart(getDateInServerTimeZone(startedAt)),
                getDateInDayEnd(getDateInServerTimeZone(endedAt)),
            ],
        };

        const contributorWhere = getContributorWhere(
            contributors,
            filterWithNoContributor,
            {
                contributorIdFilterKey: "authorId",
                contributorLoginFilterKey: "$author.github_login$",
            }
        );
        const issues = await Issue.findAll({
            attributes: ["githubCreatedAt", "githubClosedAt", "id"],
            where: {
                [sequelize.Op.and]: [
                    {
                        [sequelize.Op.or]: [
                            {
                                githubCreatedAt: dateWhereClause,
                            },
                            {
                                githubClosedAt: dateWhereClause,
                            },
                        ],
                    },
                    contributorWhere,
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
                    required: false,
                    attributes: [
                        "id",
                        "githubName",
                        "githubLogin",
                        "githubAvatarUrl",
                    ],
                },
            ],
        });

        const issuesWithAssignees = await Issue.findAll({
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
                    required: false,
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
            number | undefined,
            {
                contributor?: {
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
        for (const issueWithAuthor of issues) {
            if (!computedIssues.has(issueWithAuthor.id)) {
                if (
                    issueWithAuthor.githubCreatedAt >= startedAtDayStart &&
                    issueWithAuthor.githubCreatedAt <= endedAtDayEnd
                ) {
                    issuesOpennedCount += 1;
                }

                if (
                    issueWithAuthor.githubClosedAt &&
                    issueWithAuthor.githubClosedAt >= startedAtDayStart &&
                    issueWithAuthor.githubClosedAt <= endedAtDayEnd
                ) {
                    issuesClosedCount += 1;
                }

                computedIssues.add(issueWithAuthor.id);
            }

            const author = issueWithAuthor.author;
            const contributorIssueData = contributorsIssueDataMap.get(
                author?.id
            );
            if (!contributorIssueData) {
                contributorsIssueDataMap.set(author?.id, {
                    contributor: author
                        ? {
                              id: Number(author.id),
                              githubName: author.githubName,
                              githubLogin: author.githubLogin,
                              githubAvatarUrl: author.githubAvatarUrl,
                          }
                        : undefined,
                    assignedIssuesCount: 0,
                    authoredIssuesCount: 1,
                });
            } else {
                contributorIssueData.authoredIssuesCount += 1;
                contributorsIssueDataMap.set(author?.id, contributorIssueData);
            }
        }

        for (const issueWithAssignee of issuesWithAssignees) {
            const computeIssue = () => {
                if (!computedIssues.has(issueWithAssignee.id)) {
                    if (
                        issueWithAssignee.githubCreatedAt >=
                            startedAtDayStart &&
                        issueWithAssignee.githubCreatedAt <= endedAtDayEnd
                    ) {
                        issuesOpennedCount += 1;
                    }

                    if (
                        issueWithAssignee.githubClosedAt &&
                        issueWithAssignee.githubClosedAt >= startedAtDayStart &&
                        issueWithAssignee.githubClosedAt <= endedAtDayEnd
                    ) {
                        issuesClosedCount += 1;
                    }

                    computedIssues.add(issueWithAssignee.id);
                }
            };

            if (
                issueWithAssignee.assignees.length === 0 &&
                (filterWithNoContributor || !contributors?.length)
            ) {
                computeIssue();
                const contributorIssueData =
                    contributorsIssueDataMap.get(undefined);
                if (!contributorIssueData) {
                    contributorsIssueDataMap.set(undefined, {
                        assignedIssuesCount: 1,
                        authoredIssuesCount: 0,
                    });
                } else {
                    contributorIssueData.assignedIssuesCount += 1;
                    contributorsIssueDataMap.set(
                        undefined,
                        contributorIssueData
                    );
                }
            } else if (
                issueWithAssignee.assignees.length > 0 &&
                ((!contributors?.length && !filterWithNoContributor) ||
                    issueWithAssignee.assignees.some(
                        (assignee) =>
                            contributors?.includes(assignee.githubLogin)
                    ))
            ) {
                computeIssue();
                const assignees = issueWithAssignee.assignees.filter(
                    (assignee) =>
                        !contributors?.length ||
                        contributors?.includes(assignee.githubLogin)
                );
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
        }

        const issueDataPerContributor = Array.from(
            contributorsIssueDataMap.values()
        );

        const responseReturn: IssueMetricsDTO = {
            issueDataPerContributor,
            issuesOpennedCount,
            issuesClosedCount,
        };

        return responseReturn;
    }
}
