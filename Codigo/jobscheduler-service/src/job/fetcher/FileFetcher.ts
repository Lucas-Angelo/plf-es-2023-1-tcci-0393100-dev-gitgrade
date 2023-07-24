import { BranchService } from "../../service/BranchService";
import { CommitService } from "../../service/CommitService";
import { FileService } from "../../service/FileService";
import { RepositoryService } from "../../service/RepositoryService";
import { GitHubFileService } from "../../service/client/GitHubFileService";
import FetchUtil from "../../util/FetchUtil";

class FileFetcher {
    private repositoryService: RepositoryService;
    private branchService: BranchService;
    private commitService: CommitService;
    private gitHubFileService: GitHubFileService;
    private fileService: FileService;
    private fetchUtil: FetchUtil;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.branchService = new BranchService();
        this.commitService = new CommitService();
        this.gitHubFileService = new GitHubFileService();
        this.fileService = new FileService();
        this.fetchUtil = new FetchUtil();
    }

    async fetchFilesForRepositories() {
        const repositories = await this.repositoryService.findAll();

        for (const repository of repositories) {
            const branches = await this.branchService.findAllByField(
                "repositoryId",
                repository.id!
            );

            for (const branch of branches) {
                const commits = await this.commitService.findAllByField(
                    "branchId",
                    branch.id!
                );

                for (const commit of commits) {
                    const files =
                        (await this.fetchFilesWithRetry(
                            repository.name!,
                            commit.sha
                        )) || [];

                    for (const fileData of files) {
                        const fileAttributes = {
                            commitId: commit.id!,
                            path: fileData.filename,
                            extension: this.getFileExtension(fileData.filename),
                            additions: fileData.additions,
                            deletions: fileData.deletions,
                        };

                        if (fileData.status === "removed")
                            await this.fileService.deleteByFields({
                                commitId: commit.id!,
                                path: fileData.filename,
                            });
                        else
                            await this.fileService.createOrUpdate(
                                fileAttributes
                            );
                    }
                }
            }
        }
    }

    private async fetchFilesWithRetry(
        repositoryName: string,
        commitSha: string
    ) {
        return await this.fetchUtil.retry(async () => {
            return await this.gitHubFileService.getAllFilesFromCommit(
                repositoryName,
                commitSha
            );
        }, `Error fetching files for commit "${commitSha}" in repository "${repositoryName}"`);
    }

    private getFileExtension(filename: string): string {
        if (!filename.includes("/")) {
            if (filename.includes(".")) {
                return filename.split(".").pop()!;
            }
            return filename;
        }

        const lastSegment = filename.split("/").pop() || "";
        return lastSegment.includes(".")
            ? lastSegment.split(".").pop()!
            : lastSegment;
    }
}

export { FileFetcher };
