import { IIssueAttributes } from "../../model/Issue";
import { contributorTestingSeed } from "./contributor";
import { repositoryTestingSeed } from "./repository";

const issueTestingSeed: Array<IIssueAttributes> = [
    {
        id: 1,
        title: "Issue 1",
        authorContributorId: contributorTestingSeed[0].id,
        repositoryId: repositoryTestingSeed[3].id,
        githubId: "1",
        number: 1,
        githubCreatedAt: new Date("2023-03-20"),
        githubUpdatedAt: new Date("2023-04-20"),
        githubClosedAt: null,
        closed: false,
    },
    {
        id: 2,
        title: "Issue 2",
        authorContributorId: contributorTestingSeed[1].id,
        repositoryId: repositoryTestingSeed[3].id,
        githubId: "2",
        number: 2,
        githubCreatedAt: new Date("2023-03-20"),
        githubUpdatedAt: new Date("2023-04-20"),
        githubClosedAt: null,
        closed: false,
    },
    {
        id: 3,
        title: "Issue 3",
        authorContributorId: contributorTestingSeed[0].id,
        repositoryId: repositoryTestingSeed[3].id,
        githubId: "3",
        number: 3,
        githubCreatedAt: new Date("2023-03-20"),
        githubUpdatedAt: new Date("2023-04-20"),
        githubClosedAt: null,
        closed: false,
    },
    {
        id: 4,
        title: "Issue 4",
        authorContributorId: contributorTestingSeed[0].id,
        repositoryId: repositoryTestingSeed[3].id,
        githubId: "4",
        number: 4,
        githubCreatedAt: new Date("2023-03-20"),
        githubUpdatedAt: new Date("2023-04-20"),
        githubClosedAt: new Date("2023-05-20"),
        closed: true,
    },
    {
        id: 5,
        title: "Issue 5",
        repositoryId: repositoryTestingSeed[3].id,
        githubId: "5",
        number: 5,
        githubCreatedAt: new Date("2023-03-20"),
        githubUpdatedAt: new Date("2023-04-20"),
        githubClosedAt: null,
        closed: false,
        authorContributorId: null,
    },
];

export { issueTestingSeed };
