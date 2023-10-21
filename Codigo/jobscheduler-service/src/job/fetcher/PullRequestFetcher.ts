import logger from "../../config/LogConfig";
import { IContributorAttributes } from "../../model/Contributor";
import { IPullRequestAttributes } from "../../model/PullRequest";
import { IRepositoryAttributes } from "../../model/Repository";
import {
    GitHubPullRequestService,
    PullRequestGitHub,
} from "../../service/client/GitHubPullRequestService";
import {
    GitHubUserService,
    UserDetailsGitHub,
} from "../../service/client/GitHubUserService";
import { ContributorService } from "../../service/ContributorService";
import { PullRequestHasAssigneeContributorService } from "../../service/PullRequestHasAssigneeContributorService";
import { PullRequestService } from "../../service/PullRequestService";
import { RepositoryService } from "../../service/RepositoryService";
import FetchUtil from "../../util/FetchUtil";

class PullRequestFetcher {
    private gitHubPullRequestService: GitHubPullRequestService;
    private gitHubUserService: GitHubUserService;
    private pullRequestService: PullRequestService;
    private repositoryService: RepositoryService;
    private contributorService: ContributorService;
    private pullRequestHasAssigneeContributorService: PullRequestHasAssigneeContributorService;
    private fetchUtil: FetchUtil;

    private userDetailsCache: { [key: string]: UserDetailsGitHub } = {};
    private contributorCache: { [key: string]: IContributorAttributes } = {};

    constructor() {
        this.gitHubPullRequestService = new GitHubPullRequestService();
        this.gitHubUserService = new GitHubUserService();
        this.pullRequestService = new PullRequestService();
        this.repositoryService = new RepositoryService();
        this.contributorService = new ContributorService();
        this.pullRequestHasAssigneeContributorService =
            new PullRequestHasAssigneeContributorService();
        this.fetchUtil = new FetchUtil();
    }

    async fetchPullRequestsForRepositories() {
        try {
            logger.info("Starting Pull Request Fetcher...");

            // TODO: Fetch only repositories with automatic sync enabled
            const repositories =
                await this.repositoryService.findAllWithAutomaticSynchronizationEnable();

            for (const repository of repositories) {
                const pullRequests = await this.fetchPullRequestsWithRetry(
                    repository.name!
                );
                if (!pullRequests) {
                    logger.warn(
                        `No pull requests found for repository "${repository.name}"`
                    );
                    continue;
                }
                if (pullRequests.length === 0) {
                    logger.warn(
                        `No pull requests found for repository "${repository.name}"`
                    );
                    continue;
                }
                await this.processPullRequests(repository, pullRequests);
            }
            logger.info("Pull Requests fetched and created successfully!");
        } catch (error) {
            logger.error("Error fetching or creating pull requests:", {
                error,
            });
            throw error;
        }
    }

    private async processPullRequests(
        repository: IRepositoryAttributes,
        pullRequests: PullRequestGitHub[]
    ) {
        for (const pullRequestData of pullRequests) {
            if (!pullRequestData.id || !pullRequestData.number) {
                logger.error(
                    "Pull request data is missing required fields: id, number",
                    { pullRequestData }
                );
                continue;
            }

            const authorContributorId = await this.handleAuthor(
                pullRequestData
            );
            await this.handlePullRequest(
                repository,
                pullRequestData,
                authorContributorId
            );
        }
    }

    private async handleAuthor(pullRequestData: PullRequestGitHub) {
        let authorContributorId = null;
        if (pullRequestData.user && pullRequestData.user.login) {
            const authorDetails = await this.fetchUserDetailsWithRetry(
                pullRequestData.user!.login
            );
            const authorAttributes =
                this.mapContributorAttributes(authorDetails);
            const authorContributor =
                await this.getOrCreateContributorWithRetry(authorAttributes);
            authorContributorId = authorContributor.id;
        }
        return authorContributorId;
    }

    private async handlePullRequest(
        repository: IRepositoryAttributes,
        pullRequestData: PullRequestGitHub,
        authorContributorId?: number | null
    ) {
        const pullRequestAttributes = this.mapPullRequestAttributes(
            repository.id!,
            pullRequestData,
            authorContributorId
        );

        const pullRequest = await this.createOrUpdatePullRequestWithRetry(
            pullRequestAttributes
        );
        await this.handleAssignees(pullRequest, pullRequestData);
    }

    private async handleAssignees(
        pullRequest: IPullRequestAttributes,
        pullRequestData: PullRequestGitHub
    ) {
        if (pullRequestData.assignees && pullRequestData.assignees.length > 0) {
            for (const assigneeData of pullRequestData.assignees) {
                const assigneeDetails = await this.fetchUserDetailsWithRetry(
                    assigneeData.login
                );
                const assigneeAttributes =
                    this.mapContributorAttributes(assigneeDetails);
                const assigneeContributor =
                    await this.getOrCreateContributorWithRetry(
                        assigneeAttributes
                    );
                await this.createPullRequestAssigneeAssociationWithRetry(
                    pullRequest.id!,
                    assigneeContributor.id!
                );
            }
        }
    }

    private async fetchPullRequestsWithRetry(
        repositoryName: string
    ): Promise<PullRequestGitHub[]> {
        return await this.fetchUtil.retry<PullRequestGitHub[]>(async () => {
            return await this.gitHubPullRequestService.getAllPullRequests(
                repositoryName
            );
        }, `Error fetching pull requests for repository "${repositoryName}"`);
    }

    private async fetchUserDetailsWithRetry(
        username: string
    ): Promise<UserDetailsGitHub> {
        const cacheKey = username.toLowerCase();

        // Check if userDetails is already in the cache
        if (this.userDetailsCache[cacheKey])
            return this.userDetailsCache[cacheKey];

        // Not in the cache, fetch userDetails
        const userDetails = await this.fetchUtil.retry<UserDetailsGitHub>(
            async () => {
                return await this.gitHubUserService.getUserByUsername(username);
            },
            `Error fetching user details for contributor "${username}"`
        );

        // Add to cache
        this.userDetailsCache[cacheKey] = userDetails;
        return userDetails;
    }

    private async getOrCreateContributorWithRetry(
        contributorAttributes: IContributorAttributes
    ): Promise<IContributorAttributes> {
        const cacheKey = contributorAttributes.githubLogin!.toLowerCase();

        // Check if contributor is already in the cache
        if (this.contributorCache[cacheKey])
            return this.contributorCache[cacheKey];

        // Not in the cache, create or update contributor
        const contributor = await this.fetchUtil.retry<IContributorAttributes>(
            async () => {
                return await this.contributorService.createOrUpdate(
                    contributorAttributes
                );
            },
            `Error creating or updating contributor "${contributorAttributes.githubLogin}"`
        );

        // Add to cache
        this.contributorCache[cacheKey] = contributor;
        return contributor;
    }

    private mapContributorAttributes(
        contributorData: UserDetailsGitHub
    ): IContributorAttributes {
        return {
            githubId: contributorData.id.toString(),
            githubLogin: contributorData.login,
            githubEmail: contributorData.email,
            githubName: contributorData.name,
            githubAvatarUrl: contributorData.avatar_url,
        };
    }

    private mapPullRequestAttributes(
        repositoryId: number,
        pullRequestData: PullRequestGitHub,
        authorContributorId?: number | null
    ): IPullRequestAttributes {
        return {
            repositoryId: repositoryId,
            authorContributorId: authorContributorId,
            githubId: pullRequestData.id.toString(),
            number: pullRequestData.number,
            title: pullRequestData.title || null,
            githubCreatedAt: new Date(pullRequestData.created_at),
            githubUpdatedAt: new Date(pullRequestData.updated_at),
            githubClosedAt: pullRequestData.closed_at
                ? new Date(pullRequestData.closed_at)
                : null,
            githubMergedAt: pullRequestData.merged_at
                ? new Date(pullRequestData.merged_at)
                : null,
            closed: pullRequestData.state === "closed",
            merged: !!pullRequestData.merged_at,
        };
    }

    private async createOrUpdatePullRequestWithRetry(
        pullRequestAttributes: IPullRequestAttributes
    ): Promise<IPullRequestAttributes> {
        return await this.fetchUtil.retry<IPullRequestAttributes>(async () => {
            return await this.pullRequestService.createOrUpdate(
                pullRequestAttributes
            );
        }, `Error creating or updating pull request "${pullRequestAttributes.number}"`);
    }

    private async createPullRequestAssigneeAssociationWithRetry(
        pullRequestId: number,
        assigneeContributorId: number
    ): Promise<void> {
        return await this.fetchUtil.retry<void>(async () => {
            await this.pullRequestHasAssigneeContributorService.createAssociation(
                pullRequestId,
                assigneeContributorId
            );
        }, `Error creating association between pull request "${pullRequestId}" and assignee contributor "${assigneeContributorId}"`);
    }
}

export { PullRequestFetcher };
