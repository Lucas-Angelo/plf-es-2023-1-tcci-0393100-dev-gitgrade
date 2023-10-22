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

                const onlyIssues: IssueGitHub[] = response.data.filter(
                    (issue: IssueGitHub) => !issue.pull_request
                );
                allIssues = allIssues.concat(onlyIssues);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allIssues;
        } catch (error: unknown) {
            logger.error("Error fetching issues:", { error });
            throw new Error(
                "Error fetching issues: " + (error as Error).message
            );
        }
    }

    async createIssue(
        repositoryName: string,
        title: string,
        body: string
    ): Promise<IssueGitHub> {
        try {
            const response = await GitHubApi.request(
                "POST /repos/{owner}/{repo}/issues",
                {
                    owner: organizationName,
                    repo: repositoryName,
                    title,
                    body,
                }
            );

            return response.data;
        } catch (error: unknown) {
            logger.error("Error creating issue:", { error });
            throw new Error(
                "Error creating issue: " + (error as Error).message
            );
        }
    }
}

export { GitHubIssueService, IssueGitHub };
