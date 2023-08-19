import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";

type RepositoryGitHub =
    Endpoints["GET /orgs/{org}/repos"]["response"]["data"][0];

class GitHubRepositoryService {
    async getAllRepositories(): Promise<RepositoryGitHub[]> {
        try {
            const allRepositories: RepositoryGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /orgs/{org}/repos",
                    {
                        org: organizationName,
                        page,
                        per_page: 100,
                        type: "all",
                        state: "all",
                    }
                );

                const repositories: RepositoryGitHub[] = response.data;
                allRepositories.push(...repositories);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allRepositories;
        } catch (error: unknown) {
            logger.error("Error fetching repositories:", { error });
            throw new Error(
                "Error fetching repositories: " + (error as Error).message
            );
        }
    }
}

export { GitHubRepositoryService, RepositoryGitHub };
