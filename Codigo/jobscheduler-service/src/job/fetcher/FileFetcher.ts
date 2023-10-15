import logger from "@/config/LogConfig";
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
        // TODO: Fetch only repositories with automatic sync enabled
        const repositories =
            await this.repositoryService.findAllWithAutomaticSynchronizationEnable();

        for (const repository of repositories) {
            const branches = await this.branchService.findAllByFields({
                repositoryId: repository.id,
                fileAutomaticSynchronization: true,
            });

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

                    if (!files) {
                        logger.error(
                            "Error on fetching files, files is null:",
                            { repository, branch, commit }
                        );
                        continue;
                    }

                    for (const fileData of files) {
                        if (fileData.status === "removed") {
                            await this.fileService.deleteByFields({
                                commitId: commit.id!,
                                path: fileData.filename,
                            });
                        } else {
                            const fileAttributes = {
                                commitId: commit.id!,
                                path: fileData.filename,
                                extension: this.getFileExtension(
                                    fileData.filename
                                ),
                                additions: fileData.additions,
                                deletions: fileData.deletions,
                            };
                            await this.fileService.createOrUpdate(
                                fileAttributes
                            );
                        }
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
        const lastSegment = filename.split("/").pop() || "";
        return lastSegment.includes(".")
            ? lastSegment.split(".").pop()!
            : lastSegment;
    }
}

export { FileFetcher };
