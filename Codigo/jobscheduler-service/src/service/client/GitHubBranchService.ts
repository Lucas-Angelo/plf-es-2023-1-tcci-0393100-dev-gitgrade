import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";

type BranchGitHub =
    Endpoints["GET /repos/{owner}/{repo}/branches"]["response"]["data"][0];

class GitHubBranchService {
    async getAllBranches(repo: string): Promise<BranchGitHub[]> {
        try {
            const allBranches: BranchGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/branches",
                    {
                        owner: organizationName,
                        repo,
                        page,
                        per_page: 100,
                    }
                );

                const branches: BranchGitHub[] = response.data;
                allBranches.push(...branches);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allBranches;
        } catch (error: unknown) {
            logger.error("Error fetching branches:", { error });

            throw new Error(
                "Error fetching branches: " + (error as Error).message
            );
        }
    }
}

export { BranchGitHub, GitHubBranchService };
