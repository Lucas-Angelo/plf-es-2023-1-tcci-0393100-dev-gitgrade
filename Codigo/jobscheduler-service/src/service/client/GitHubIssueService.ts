import { Endpoints } from "@octokit/types";
import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

type IssueGitHub =
    Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][0];

class GitHubIssueService {
    async getAllIssues(repositoryName: string): Promise<IssueGitHub[]> {
        try {
            let allIssues: IssueGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/issues",
                    {
                        owner: organizationName,
                        repo: repositoryName,
                        page,
                        per_page: 100,
                        state: "all",
                    }
                );

                const issues: IssueGitHub[] = response.data;
                allIssues = allIssues.concat(issues);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allIssues;
        } catch (error: unknown) {
            logger.error("Error fetching issues:", error);
            throw new Error(
                "Error fetching issues: " + (error as Error).message
            );
        }
    }
}

export { GitHubIssueService, IssueGitHub };
