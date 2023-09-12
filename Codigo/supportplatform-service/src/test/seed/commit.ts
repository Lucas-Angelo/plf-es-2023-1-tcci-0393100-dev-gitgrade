import { branchTestingSeed } from "./branch";
import { contributorTestingSeed } from "./contributor";

const commitTestingSeed = [
    {
        id: 1,
        branchId: branchTestingSeed[0].id,
        contributorId: contributorTestingSeed[0].id,
        sha: "sha1",
        message: "first commit",
        committedDate: new Date("2023-01-10T02:01:00-03:00"),
    },
    {
        id: 2,
        branchId: branchTestingSeed[0].id,
        contributorId: contributorTestingSeed[1].id,
        sha: "sha2",
        message: "message2",
        committedDate: new Date("2023-02-03T15:52:12-03:00"),
    },
    {
        id: 3,
        branchId: branchTestingSeed[0].id,
        contributorId: contributorTestingSeed[2].id,
        sha: "sha3",
        message: "message3",
        committedDate: new Date("2023-02-04T23:12:00-03:00"),
    },
    {
        id: 4,
        branchId: branchTestingSeed[0].id,
        contributorId: contributorTestingSeed[2].id,
        sha: "sha4",
        message: "message4",
        committedDate: new Date("2023-02-07T12:00:00-03:00"),
    },
    {
        id: 5,
        branchId: branchTestingSeed[0].id,
        contributorId: contributorTestingSeed[2].id,
        sha: "sha5",
        message: "message5",
        committedDate: new Date("2023-03-01T12:00:00-03:00"),
    },
    {
        id: 6,
        branchId: branchTestingSeed[1].id,
        contributorId: contributorTestingSeed[0].id,
        sha: "sha1",
        message: "first commit",
        committedDate: new Date("2023-01-10T02:01:00-03:00"),
    },
    {
        id: 7,
        branchId: branchTestingSeed[1].id,
        contributorId: contributorTestingSeed[1].id,
        sha: "sha2",
        message: "message2",
        committedDate: new Date("2023-02-03T15:52:12-03:00"),
    },
    {
        id: 8,
        branchId: branchTestingSeed[1].id,
        contributorId: contributorTestingSeed[2].id,
        sha: "sha3",
        message: "message3",
        committedDate: new Date("2023-02-04T23:12:00-03:00"),
    },
    {
        id: 9,
        branchId: branchTestingSeed[1].id,
        contributorId: contributorTestingSeed[2].id,
        sha: "sha4",
        message: "message4",
        committedDate: new Date("2023-02-07T12:00:00-03:00"),
    },
];

export { commitTestingSeed };
