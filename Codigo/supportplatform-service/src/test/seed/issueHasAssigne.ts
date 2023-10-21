import { contributorTestingSeed } from "./contributor";
import { issueTestingSeed } from "./issue";

const issueHasAssigneeTestingSeed = [
    {
        assigneeContributorId: contributorTestingSeed[0].id,
        issueId: issueTestingSeed[0].id,
    },
    {
        assigneeContributorId: contributorTestingSeed[1].id,
        issueId: issueTestingSeed[0].id,
    },
    {
        assigneeContributorId: contributorTestingSeed[0].id,
        issueId: issueTestingSeed[1].id,
    },
    {
        assigneeContributorId: contributorTestingSeed[1].id,
        issueId: issueTestingSeed[3].id,
    },
    {
        assigneeContributorId: contributorTestingSeed[1].id,
        issueId: issueTestingSeed[4].id,
    },
];

export { issueHasAssigneeTestingSeed };
