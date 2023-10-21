import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";
import { GitHubCommitService } from "./GitHubCommitService";

interface IHttpError {
    status: number;
    message?: string;
}

type GitHubFile =
    Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]["files"];

interface IGitHubFileStatus {
    fileName: string;
    status: "exists" | "not_exists";
    deliveryDate: Date | null;
}

class GitHubFileService {
    private gitHubCommitService: GitHubCommitService;

    constructor() {
        this.gitHubCommitService = new GitHubCommitService();
    }

    async getAllFilesFromCommit(
        repo: string,
        ref: string
    ): Promise<GitHubFile> {
        try {
            let page = 1;
            let hasNextPage = true;
            const allFiles: GitHubFile = [];

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/commits/{ref}",
                    {
                        owner: organizationName,
                        repo,
                        ref,
                        page,
                        per_page: 100,
                    }
                );

                const files = response.data.files;
                if (files && files.length) allFiles.push(...files);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allFiles;
        } catch (error: unknown) {
            logger.error("Error fetching files from commit:", { error });
            throw new Error(
                "Error fetching files from commit: " + (error as Error).message
            );
        }
    }

    async getFileCreationDate(
        repo: string,
        path: string,
        ref: string
    ): Promise<IGitHubFileStatus> {
        try {
            const response = await GitHubApi.request(
                "GET /repos/{owner}/{repo}/contents/{path}",
                {
                    owner: organizationName,
                    repo,
                    path,
                    ref,
                }
            );

            if (response.status === 200 && response.data.type === "file") {
                // Obtém a lista de commits do arquivo
                const commitDate = await this.getCommitDate(repo, path, ref);

                if (!commitDate) {
                    logger.error(
                        `Error getting creation date of file ${path} of repo ${repo}`
                    );
                    throw new Error(
                        `Error getting creation date of file ${path} of repo ${repo}`
                    );
                }

                const fileStatus: IGitHubFileStatus = {
                    fileName: path,
                    status: "exists",
                    deliveryDate: commitDate,
                };
                return fileStatus;
            } else if (response.status === 404) {
                const fileStatus: IGitHubFileStatus = {
                    fileName: path,
                    status: "not_exists",
                    deliveryDate: null,
                };
                return fileStatus;
            } else {
                logger.error(
                    `Error getting creation date of file ${path} of repo ${repo}`
                );
                throw new Error(
                    `Error getting creation date of file ${path} of repo ${repo}`
                );
            }
        } catch (error: unknown) {
            if (
                error &&
                typeof error === "object" &&
                "status" in error &&
                (error as IHttpError).status === 404
            ) {
                const fileStatus: IGitHubFileStatus = {
                    fileName: path,
                    status: "not_exists",
                    deliveryDate: null,
                };
                return fileStatus;
            }

            logger.error("Error checking if file exists:", { error });
            throw new Error(
                "Error checking if file exists: " + (error as Error).message
            );
        }
    }

    private async getCommitDate(
        repo: string,
        path: string,
        ref: string
    ): Promise<Date | null> {
        const allCommitsOfTheFile =
            await this.gitHubCommitService.getAllCommitsOfFile(repo, path, ref);

        for (const commit of allCommitsOfTheFile) {
            if (commit.commit.committer && commit.commit.committer.date) {
                return new Date(commit.commit.committer.date);
            }
        }

        return null;
    }

    async getFileContent(
        repo: string,
        path: string,
        ref: string
    ): Promise<string> {
        try {
            const response = await GitHubApi.request(
                "GET /repos/{owner}/{repo}/contents/{path}",
                {
                    owner: organizationName,
                    repo,
                    path,
                    ref,
                }
            );

            return response.data.content;
        } catch (error: unknown) {
            logger.error("Error fetching file content:", { error });
            throw new Error(
                "Error fetching file content: " + (error as Error).message
            );
        }
    }
}

export { GitHubFile, GitHubFileService, IGitHubFileStatus };
