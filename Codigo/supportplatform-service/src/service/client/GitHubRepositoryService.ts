import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import path from "path";

import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dirname from "es-dirname";
import AppError from "../../error/AppError";

const projectRootPath = path.join(dirname(), "../../../");
const repositoriesTempDirectory = path.join(
    projectRootPath,
    "./temp/repositories"
);

type RepositoryGitHub =
    Endpoints["GET /orgs/{org}/repos"]["response"]["data"][0];

class GitHubRepositoryService {
    async cloneRepository(repoName: string): Promise<void> {
        try {
            const { data } = await GitHubApi.request(
                "GET /repos/{owner}/{repo}",
                {
                    owner: organizationName,
                    repo: repoName,
                }
            );

            const authenticatedCloneUrl = this.constructCloneUrl(
                data.clone_url,
                EnvConfig.GITHUB_PERSONAL_ACCESS_TOKEN!
            );
            this.gitClone(
                authenticatedCloneUrl,
                `${repositoriesTempDirectory}/${repoName}`
            );

            logger.info(`Repository ${repoName} cloned successfully!`);
        } catch (error: unknown) {
            logger.error(`Error cloning repository ${repoName}:`, { error });
            throw new Error(
                `Error cloning repository ${repoName}: ${
                    (error as Error).message
                }`
            );
        }
    }

    private constructCloneUrl(baseCloneUrl: string, token: string): string {
        const protocolAndUrl = baseCloneUrl.split("://");
        return `${protocolAndUrl[0]}://${token}@${protocolAndUrl[1]}`;
    }

    private async gitClone(
        cloneUrl: string,
        destinationFolder: string
    ): Promise<void> {
        // eslint-disable-next-line no-useless-catch
        try {
            // Check if destination folder exists
            if (existsSync(destinationFolder)) {
                // Remove directory recursively
                logger.info(
                    `Removing existing directory ${destinationFolder}...`
                );
                rmSync(destinationFolder, { recursive: true, force: true });
            }

            logger.info(`Cloning repository ${cloneUrl}...`);
            // Clone repository without history
            execSync(`git clone --depth 1 ${cloneUrl} ${destinationFolder}`);
            logger.info(`Repository cloned successfully!`);
        } catch (error) {
            throw new AppError(`Error cloning repository ${cloneUrl}`, 500, {
                error,
            });
        }
    }
}

export { GitHubRepositoryService, RepositoryGitHub };
