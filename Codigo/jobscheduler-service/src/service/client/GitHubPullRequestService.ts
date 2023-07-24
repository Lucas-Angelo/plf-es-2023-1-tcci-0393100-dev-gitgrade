import { Endpoints } from "@octokit/types";
import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

type PullRequestGitHub =
    Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"][0];

class GitHubPullRequestService {
    async getAllPullRequests(
        repositoryName: string
    ): Promise<PullRequestGitHub[]> {
        try {
            let allPullRequests: PullRequestGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/pulls",
                    {
                        owner: organizationName,
                        repo: repositoryName,
                        page,
                        per_page: 100,
                        state: "all",
                    }
                );

                const pullRequests: PullRequestGitHub[] = response.data;
                allPullRequests = allPullRequests.concat(pullRequests);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allPullRequests;
        } catch (error: unknown) {
            logger.error("Error fetching pull requests:", error);
            throw new Error(
                "Error fetching pull requests: " + (error as Error).message
            );
        }
    }
}

export { GitHubPullRequestService, PullRequestGitHub };
