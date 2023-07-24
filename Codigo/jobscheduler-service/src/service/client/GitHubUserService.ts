import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

import { Endpoints } from "@octokit/types";

type UserDetailsGitHub = Endpoints["GET /users/{username}"]["response"]["data"];

class GitHubUserService {
    async getUserByUsername(username: string): Promise<UserDetailsGitHub> {
        try {
            const userDetails = await GitHubApi.request(
                "GET /users/{username}",
                {
                    username,
                }
            );

            return userDetails.data;
        } catch (error: unknown) {
            logger.error("Error fetching user by username:", error);
            throw new Error(
                "Error fetching user by username: " + (error as Error).message
            );
        }
    }
}

export { GitHubUserService, UserDetailsGitHub };
