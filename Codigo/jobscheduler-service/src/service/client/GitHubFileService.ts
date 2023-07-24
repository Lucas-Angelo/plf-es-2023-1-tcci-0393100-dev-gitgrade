import EnvConfig from "../../config/EnvConfig";
import GitHubApi from "../../config/GitHubApiConfig";
import logger from "../../config/LogConfig";

const organizationName =
    EnvConfig.GITHUB_ORGANIZATION_NAME || "github-org-name";

import { Endpoints } from "@octokit/types";

type CommitFilesResponse =
    Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]["files"];

class GitHubFileService {
    async getAllFilesFromCommit(
        repo: string,
        ref: string
    ): Promise<CommitFilesResponse> {
        try {
            let page = 1;
            let hasNextPage = true;
            const allFiles: CommitFilesResponse = [];

            while (hasNextPage) {
                const response = await GitHubApi.request(
                    "GET /repos/{owner}/{repo}/commits/{ref}",
                    {
                        owner: organizationName,
                        repo,
                        ref,
                        page,
                        per_page: 100,
                    }
                );

                const files = response.data.files;
                if (files && files.length) allFiles.push(...files);

                const linkHeader = response.headers.link;
                hasNextPage = linkHeader
                    ? linkHeader.includes('rel="next"')
                    : false;

                if (hasNextPage) page += 1;
            }

            return allFiles;
        } catch (error: unknown) {
            logger.error("Error fetching files from commit:", error);
            throw new Error(
                "Error fetching files from commit: " + (error as Error).message
            );
        }
    }
}

export { CommitFilesResponse as CommitFile, GitHubFileService };
