import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";

type CommitGitHub =
    Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][0];

class GitHubCommitService {
    async getAllCommitsFromBranch(
        repo: string,
        branch: string
    ): Promise<CommitGitHub[]> {
        try {
            const allCommits: CommitGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/commits",
                    {
                        owner: organizationName,
                        repo,
                        sha: branch,
                        page,
                        per_page: 100,
                    }
                );

                const commits: CommitGitHub[] = response.data;
                allCommits.push(...commits);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allCommits.reverse(); // .reverse() To get the oldest commits first (cronological order)
        } catch (error: unknown) {
            logger.error("Error fetching commits:", { error });
            throw new Error(
                "Error fetching commits: " + (error as Error).message
            );
        }
    }

    async getAllCommitsOfFile(
        repo: string,
        path: string,
        ref: string
    ): Promise<CommitGitHub[]> {
        try {
            const allCommits: CommitGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/commits",
                    {
                        owner: organizationName,
                        repo,
                        path,
                        sha: ref,
                        page,
                        per_page: 100,
                    }
                );

                const commits: CommitGitHub[] = response.data;
                allCommits.push(...commits);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allCommits.reverse(); // .reverse() To get the oldest commits first (cronological order)
        } catch (error: unknown) {
            logger.error("Error fetching commits:", { error });
            throw new Error(
                "Error fetching commits: " + (error as Error).message
            );
        }
    }
}

export { CommitGitHub, GitHubCommitService };
