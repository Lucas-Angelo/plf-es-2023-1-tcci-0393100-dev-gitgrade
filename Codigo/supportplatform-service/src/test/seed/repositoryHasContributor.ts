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
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[0].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[1].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[2].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[3].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[4].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[5].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[6].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[7].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[8].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[9].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[10].id,
    },
    {
        repositoryId: repositoryTestingSeed[2].id,
        contributorId: contributorTestingSeed[11].id,
    },
];

export { repositoryHasContributorSeed };
