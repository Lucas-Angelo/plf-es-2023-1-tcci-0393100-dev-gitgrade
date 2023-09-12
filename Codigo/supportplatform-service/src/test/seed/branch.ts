import { repositoryTestingSeed } from "./repository";

const branchTestingSeed = [
    {
        id: 1,
        name: "main",
        repositoryId: repositoryTestingSeed[0].id,
        commitAutomaticSynchronization: false,
        fileAutomaticSynchronization: false,
    },
    {
        id: 2,
        name: "dev",
        repositoryId: repositoryTestingSeed[0].id,
        commitAutomaticSynchronization: false,
        fileAutomaticSynchronization: false,
    },
    {
        id: 3,
        name: "main",
        repositoryId: repositoryTestingSeed[1].id,
        commitAutomaticSynchronization: false,
        fileAutomaticSynchronization: false,
    },
    {
        id: 4,
        name: "master",
        repositoryId: repositoryTestingSeed[1].id,
        commitAutomaticSynchronization: false,
        fileAutomaticSynchronization: false,
    },
];

export { branchTestingSeed };
