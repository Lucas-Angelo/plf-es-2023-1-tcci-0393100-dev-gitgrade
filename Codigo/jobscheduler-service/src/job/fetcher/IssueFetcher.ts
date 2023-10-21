import logger from "../../config/LogConfig";
import { IContributorAttributes } from "../../model/Contributor";
import { IIssueAttributes } from "../../model/Issue"; // Assuming you have a similar structure for Issues
import { IRepositoryAttributes } from "../../model/Repository";
import {
    GitHubIssueService,
    IssueGitHub, // New model
} from "../../service/client/GitHubIssueService";
import {
    GitHubUserService,
    UserDetailsGitHub,
} from "../../service/client/GitHubUserService";
import { ContributorService } from "../../service/ContributorService";
import { IssueHasAssigneeContributorService } from "../../service/IssueHasAssigneeContributorService"; // Updated service name
import { IssueService } from "../../service/IssueService"; // New service
import { RepositoryService } from "../../service/RepositoryService";
import FetchUtil from "../../util/FetchUtil";

class IssueFetcher {
    private gitHubIssueService: GitHubIssueService;
    private gitHubUserService: GitHubUserService;
    private issueService: IssueService;
    private repositoryService: RepositoryService;
    private contributorService: ContributorService;
    private issueHasAssigneeContributorService: IssueHasAssigneeContributorService;
    private fetchUtil: FetchUtil;

    private userDetailsCache: { [key: string]: UserDetailsGitHub } = {};
    private contributorCache: { [key: string]: IContributorAttributes } = {};

    constructor() {
        this.gitHubIssueService = new GitHubIssueService();
        this.gitHubUserService = new GitHubUserService();
        this.issueService = new IssueService();
        this.repositoryService = new RepositoryService();
        this.contributorService = new ContributorService();
        this.issueHasAssigneeContributorService =
            new IssueHasAssigneeContributorService();
        this.fetchUtil = new FetchUtil();
    }

    async fetchIssuesForRepositories() {
        try {
            logger.info("Starting Issue Fetcher...");

            // TODO: Fetch only repositories with automatic sync enabled
            const repositories =
                await this.repositoryService.findAllWithAutomaticSynchronizationEnable();

            for (const repository of repositories) {
                const issues = await this.fetchIssuesWithRetry(
                    repository.name!
                );
                if (!issues) {
                    logger.error("Error on fetching issues, issues is null:", {
                        repository,
                        issues,
                    });
                    continue;
                }
                if (issues.length === 0) {
                    logger.warn(
                        `No issues found for repository "${repository.name}"`
                    );
                    continue;
                }
                await this.processIssues(repository, issues);
            }
            logger.info("Issues fetched and created successfully!");
        } catch (error) {
            logger.error("Error fetching or creating issues:", { error });
            throw error;
        }
    }

    private async processIssues(
        repository: IRepositoryAttributes,
        issues: IssueGitHub[]
    ) {
        for (const issueData of issues) {
            if (!issueData.id || !issueData.number) {
                logger.error(
                    "Issue data is missing required fields: id, number",
                    { issueData }
                );
                continue;
            }

            const authorContributorId = await this.handleAuthor(issueData);
            await this.handleIssue(repository, issueData, authorContributorId);
        }
    }

    private async handleAuthor(issueData: IssueGitHub) {
        let authorContributorId = null;
        if (issueData.user && issueData.user.login) {
            const authorDetails = await this.fetchUserDetailsWithRetry(
                issueData.user!.login
            );
            const authorAttributes =
                this.mapContributorAttributes(authorDetails);
            const authorContributor =
                await this.getOrCreateContributorWithRetry(authorAttributes);
            authorContributorId = authorContributor.id;
        }
        return authorContributorId;
    }

    private async handleIssue(
        repository: IRepositoryAttributes,
        issueData: IssueGitHub,
        authorContributorId?: number | null
    ) {
        const issueAttributes = this.mapIssueAttributes(
            repository.id!,
            issueData,
            authorContributorId
        );

        const issue = await this.createOrUpdateIssueWithRetry(issueAttributes);
        await this.handleAssignees(issue, issueData);
    }

    private async handleAssignees(
        issue: IIssueAttributes,
        issueData: IssueGitHub
    ) {
        if (issueData.assignees && issueData.assignees.length > 0) {
            for (const assigneeData of issueData.assignees) {
                const assigneeDetails = await this.fetchUserDetailsWithRetry(
                    assigneeData.login
                );
                const assigneeAttributes =
                    this.mapContributorAttributes(assigneeDetails);
                const assigneeContributor =
                    await this.getOrCreateContributorWithRetry(
                        assigneeAttributes
                    );
                await this.createIssueAssigneeAssociationWithRetry(
                    issue.id!,
                    assigneeContributor.id!
                );
            }
        }
    }

    private async fetchIssuesWithRetry(
        repositoryName: string
    ): Promise<IssueGitHub[]> {
        return await this.fetchUtil.retry<IssueGitHub[]>(async () => {
            return await this.gitHubIssueService.getAllIssues(repositoryName);
        }, `Error fetching issues for repository "${repositoryName}"`);
    }

    private async fetchAndCreateIssue(
        repositoryId: number,
        issueData: IssueGitHub
    ) {
        const authorDetails = await this.fetchUserDetailsWithRetry(
            issueData!.user!.login
        );
        const authorAttributes: IContributorAttributes =
            this.mapContributorAttributes(authorDetails);
        const authorContributor = await this.getOrCreateContributorWithRetry(
            authorAttributes
        );

        const issueAttributes: IIssueAttributes = this.mapIssueAttributes(
            repositoryId,
            issueData,
            authorContributor.id!
        );
        const issue = await this.createOrUpdateIssueWithRetry(issueAttributes);

        if (issueData.assignees && issueData.assignees.length > 0) {
            for (const assigneeData of issueData.assignees) {
                const assigneeDetails = await this.fetchUserDetailsWithRetry(
                    assigneeData.login
                );
                const assigneeAttributes: IContributorAttributes =
                    this.mapContributorAttributes(assigneeDetails);
                const assigneeContributor =
                    await this.getOrCreateContributorWithRetry(
                        assigneeAttributes
                    );

                await this.createIssueAssigneeAssociationWithRetry(
                    issue.id!,
                    assigneeContributor.id!
                );
            }
        }
    }

    private async fetchUserDetailsWithRetry(
        username: string
    ): Promise<UserDetailsGitHub> {
        const cacheKey = username.toLowerCase();

        // Check if userDetails is already in the cache
        if (this.userDetailsCache[cacheKey]) {
            return this.userDetailsCache[cacheKey];
        }

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
        const cacheKey = `${contributorAttributes.githubId}_${contributorAttributes.githubLogin}`;

        // Check if contributor is already in the cache
        if (this.contributorCache[cacheKey]) {
            return this.contributorCache[cacheKey];
        }

        // Not in the cache, create or update the contributor
        return await this.fetchUtil.retry<IContributorAttributes>(async () => {
            const contributor = await this.contributorService.createOrUpdate(
                contributorAttributes
            );
            // Add contributor to the cache
            this.contributorCache[cacheKey] = contributor;
            return contributor;
        }, `Error creating or updating contributor "${contributorAttributes.githubLogin}"`);
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

    private mapIssueAttributes(
        repositoryId: number,
        issueData: IssueGitHub,
        authorContributorId?: number | null
    ): IIssueAttributes {
        return {
            repositoryId: repositoryId,
            authorContributorId: authorContributorId,
            githubId: issueData.id.toString(),
            number: issueData.number,
            title: issueData.title || null,
            githubCreatedAt: new Date(issueData.created_at),
            githubUpdatedAt: new Date(issueData.updated_at),
            githubClosedAt: issueData.closed_at
                ? new Date(issueData.closed_at)
                : null,
            closed: issueData.state === "closed",
        };
    }

    private async createOrUpdateIssueWithRetry(
        issueAttributes: IIssueAttributes
    ): Promise<IIssueAttributes> {
        return await this.fetchUtil.retry<IIssueAttributes>(async () => {
            return await this.issueService.createOrUpdate(issueAttributes);
        }, `Error creating or updating issue "${issueAttributes.number}"`);
    }

    private async createIssueAssigneeAssociationWithRetry(
        issueId: number,
        assigneeContributorId: number
    ): Promise<void> {
        return await this.fetchUtil.retry<void>(async () => {
            await this.issueHasAssigneeContributorService.createAssociation(
                issueId,
                assigneeContributorId
            );
        }, `Error creating association between issue "${issueId}" and assignee contributor "${assigneeContributorId}"`);
    }
}

export { IssueFetcher };
