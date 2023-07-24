import logger from "../../config/LogConfig";
import { IRepositoryAttributes } from "../../model/Repository";
import {
    GitHubRepositoryService,
    RepositoryGitHub,
} from "../../service/client/GitHubRepositoryService";
import { RepositoryService } from "../../service/RepositoryService";
import FetchUtil from "../../util/FetchUtil";

class RepositoryFetcher {
    private gitHubRepositoryService: GitHubRepositoryService;
    private repositoryService: RepositoryService;
    private fetchUtil: FetchUtil;

    constructor() {
        this.gitHubRepositoryService = new GitHubRepositoryService();
        this.repositoryService = new RepositoryService();
        this.fetchUtil = new FetchUtil();
    }

    async createOrUpdateRepositories() {
        try {
            logger.info("Starting Repository Fetcher...");
            const repositories: RepositoryGitHub[] = await this.fetchUtil.retry(
                () => this.gitHubRepositoryService.getAllRepositories(),
                "Error fetching repositories"
            );

            for (const repoData of repositories) {
                await this.fetchAndCreateOrUpdateRepository(repoData);
            }
        } catch (error) {
            logger.error("Error fetching repositories:", error);
            throw error;
        }
    }

    private async fetchAndCreateOrUpdateRepository(repoData: RepositoryGitHub) {
        const repositoryAttributes: IRepositoryAttributes =
            this.mapRepositoryAttributes(repoData);

        await this.fetchUtil.retry(
            () => this.repositoryService.createOrUpdate(repositoryAttributes),
            `Error finding or creating repository "${repositoryAttributes.name}"`
        );
    }

    private mapRepositoryAttributes(
        repoData: RepositoryGitHub
    ): IRepositoryAttributes {
        return {
            githubId: repoData.id.toString(),
            name: repoData.name,
            description: repoData.description,
            stargazerCount: repoData.stargazers_count,
            forkCount: repoData.forks_count,
            githubCreatedAt: repoData.created_at
                ? new Date(repoData.created_at)
                : null,
            githubUpdatedAt: repoData.updated_at
                ? new Date(repoData.updated_at)
                : null,
            hasProjectsEnabled: repoData.has_projects,
            hasIssuesEnabled: repoData.has_issues,
            primaryLanguage: repoData.language,
            licenseName: repoData.license ? repoData.license.name : null,
            defaultBranch: repoData.default_branch,
            automaticSynchronization: undefined,
            synchronizing: undefined,
            lastSyncAt: undefined,
        };
    }
}

export { RepositoryFetcher };
