import { Endpoints } from "@octokit/types";
import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

type ContributorGitHub =
    Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"][0];

type MemberGitHub = Endpoints["GET /orgs/{org}/members"]["response"]["data"][0];

class GitHubContributorService {
    async getAllOrganizationMembers(): Promise<MemberGitHub[]> {
        try {
            let allMembers: MemberGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /orgs/{org}/members",
                    {
                        org: organizationName,
                        page,
                        per_page: 100,
                    }
                );

                const members: MemberGitHub[] = response.data;
                allMembers = allMembers.concat(members);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allMembers;
        } catch (error: unknown) {
            logger.error("Error fetching organization members:", { error });
            throw new Error(
                "Error fetching organization members: " +
                    (error as Error).message
            );
        }
    }

    async getAllRepositoriesContributors(
        repositoryName: string
    ): Promise<ContributorGitHub[]> {
        try {
            let allContributors: ContributorGitHub[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/contributors",
                    {
                        owner: organizationName,
                        repo: repositoryName,
                        page,
                        per_page: 100,
                    }
                );

                const contributors: ContributorGitHub[] = response.data;
                allContributors = allContributors.concat(contributors);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) {
                    page += 1;
                }
            }

            return allContributors;
        } catch (error: unknown) {
            logger.error("Error fetching contributors:", { error });
            throw new Error(
                "Error fetching contributors: " + (error as Error).message
            );
        }
    }
}

export { ContributorGitHub, GitHubContributorService, MemberGitHub };
