import { contributorTestingSeed } from "./contributor";
import { repositoryTestingSeed } from "./repository";

const repositoryHasContributorSeed = [
    {
        repositoryId: repositoryTestingSeed[0].id,
        contributorId: contributorTestingSeed[0].id,
    },
    {
        repositoryId: repositoryTestingSeed[0].id,
        contributorId: contributorTestingSeed[1].id,
    },
    {
        repositoryId: repositoryTestingSeed[0].id,
        contributorId: contributorTestingSeed[2].id,
    },
    {
        repositoryId: repositoryTestingSeed[1].id,
        contributorId: contributorTestingSeed[3].id,
    },
];

export { repositoryHasContributorSeed };
