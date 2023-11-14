import { AxiosError } from "axios";
import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";

import { Endpoints } from "@octokit/types";

type UserDetailsGitHub = Endpoints["GET /users/{username}"]["response"]["data"];
type OrganizationMembershipGitHub =
    Endpoints["GET /orgs/{org}/memberships/{username}"]["response"]["data"];

class GitHubUserService {
    async isUserMemberOfOrganization(username: string): Promise<boolean> {
        try {
            await GitHubApi.request(
                `GET /orgs/${EnvConfig.GITHUB_ORGANIZATION_NAME}/members/${username}`,
                {
                    org: EnvConfig.GITHUB_ORGANIZATION_NAME,
                    username,
                }
            );
            return true;
        } catch (error: unknown) {
            if (error instanceof Error && "status" in error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    return false; // User isn't a member of the organization
                }
            }
            throw new Error(
                "Error checking user's organization membership: " +
                    (error as Error).message
            );
        }
    }

    async isUserAdminOfOrganization(username: string): Promise<boolean> {
        try {
            const membership = await GitHubApi.request(
                `GET /orgs/${EnvConfig.GITHUB_ORGANIZATION_NAME}/memberships/{username}`,
                {
                    org: EnvConfig.GITHUB_ORGANIZATION_NAME,
                    username,
                }
            );

            const membershipData =
                membership.data as OrganizationMembershipGitHub;

            return membershipData.role === "admin";
        } catch (error: unknown) {
            throw new Error(
                "Error checking user's organization membership: " +
                    (error as Error).message
            );
        }
    }
}

export { GitHubUserService, OrganizationMembershipGitHub, UserDetailsGitHub };
