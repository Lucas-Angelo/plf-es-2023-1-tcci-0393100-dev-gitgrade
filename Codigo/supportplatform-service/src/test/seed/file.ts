import { IFileAttributes } from "../../model/File";
import { commitTestingSeed } from "./commit";

const fileTestingSeed: Array<IFileAttributes> = [
    {
        id: 1,
        additions: 12,
        deletions: 2,
        commitId: commitTestingSeed[0].id,
        path: "src/file1.ts",
        extension: "ts",
    },
    {
        id: 2,
        additions: 100,
        deletions: 25,
        commitId: commitTestingSeed[0].id,
        path: "src/file2.ts",
        extension: "ts",
    },
    {
        id: 3,
        additions: 0,
        deletions: 5,
        commitId: commitTestingSeed[1].id,
        path: "src/file1.ts",
        extension: "ts",
    },
    {
        id: 4,
        additions: 25,
        deletions: 0,
        commitId: commitTestingSeed[2].id,
        path: "src/file3.ts",
        extension: "ts",
    },
    {
        id: 5,
        additions: 25,
        deletions: 0,
        commitId: commitTestingSeed[3].id,
        path: "src/index.html",
        extension: "html",
    },
    {
        id: 6,
        additions: 0,
        deletions: 5,
        commitId: commitTestingSeed[4].id,
        path: "src/file1.ts",
        extension: "ts",
    },
    {
        id: 7,
        additions: 25,
        deletions: 0,
        commitId: commitTestingSeed[4].id,
        path: "src/style.css",
        extension: "css",
    },
    {
        id: 8,
        additions: 30,
        deletions: 0,
        commitId: commitTestingSeed[4].id,
        path: "src/pagina2.html",
        extension: "html",
    },
];

export { fileTestingSeed };
