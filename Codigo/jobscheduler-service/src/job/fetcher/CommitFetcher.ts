import logger from "../../config/LogConfig";
import { ICommitAttributes } from "../../model/Commit";
import { IContributorAttributes } from "../../model/Contributor";
import { Repository } from "../../model/Repository";
import { BranchService } from "../../service/BranchService";
import { CommitService } from "../../service/CommitService";
import { ContributorService } from "../../service/ContributorService";
import { RepositoryService } from "../../service/RepositoryService";
import {
    CommitGitHub,
    GitHubCommitService,
} from "../../service/client/GitHubCommitService";
import {
    GitHubUserService,
    UserDetailsGitHub,
} from "../../service/client/GitHubUserService";
import FetchUtil from "../../util/FetchUtil";

class CommitFetcher {
    private gitHubCommitService: GitHubCommitService;
    private gitHubUserService: GitHubUserService;
    private commitService: CommitService;
    private repositoryService: RepositoryService;
    private branchService: BranchService;
    private contributorService: ContributorService;
    private fetchUtil: FetchUtil;

    private userDetailsCache: { [key: string]: UserDetailsGitHub } = {};
    private contributorCache: { [key: string]: IContributorAttributes } = {};
    private commitCache: Map<string, ICommitAttributes> = new Map();

    constructor() {
        this.gitHubCommitService = new GitHubCommitService();
        this.gitHubUserService = new GitHubUserService();
        this.commitService = new CommitService();
        this.repositoryService = new RepositoryService();
        this.branchService = new BranchService();
        this.contributorService = new ContributorService();
        this.fetchUtil = new FetchUtil();
    }

    async fetchCommitsForRepositories(repositoryIds?: Array<number>) {
        try {
            logger.info("Starting Commit Fetcher...");

            let repositories: Repository[];

            if (repositoryIds && repositoryIds.length > 0) {
                repositories = await this.repositoryService.findAllByField(
                    "id",
                    repositoryIds
                );
            } else {
                repositories =
                    await this.repositoryService.findAllWithAutomaticSynchronizationEnable();
            }

            for (const repository of repositories) {
                const branches = await this.branchService.findAllByFields({
                    repositoryId: repository.id,
                    commitAutomaticSynchronization: true,
                });

                for (const branch of branches) {
                    const allCommitsFromDatabase =
                        await this.commitService.findAllByField(
                            "branchId",
                            branch.id!
                        );

                    const commits = await this.fetchCommitsFromBranchWithRetry(
                        repository.name!,
                        branch.name
                    );

                    if (!commits) {
                        logger.error(
                            "Error on fetching commits, commits is null:",
                            { repository, branch }
                        );
                        continue;
                    }

                    const allCommitsFromGitHubUpdated = [];
                    for (const commitData of commits) {
                        if (!commitData.sha || !commitData.commit) {
                            logger.error(
                                "Error on fetching commit, commit without sha or commit data:",
                                { commitData }
                            );
                            continue;
                        }

                        let authorContributorId: number | null = null;

                        if (commitData.author && commitData.author.login) {
                            const authorDetails =
                                await this.fetchUserDetailsWithRetry(
                                    commitData.author.login
                                );

                            if (authorDetails && authorDetails.id) {
                                const authorAttributes: IContributorAttributes =
                                    this.mapContributorAttributes(
                                        authorDetails
                                    );
                                const authorContributor =
                                    await this.getOrCreateContributorWithRetry(
                                        authorAttributes
                                    );

                                authorContributorId = authorContributor.id!;
                            }
                        }

                        const commitAttributes: ICommitAttributes =
                            this.mapCommitAttributes(
                                branch.id!,
                                commitData,
                                authorContributorId
                            );
                        allCommitsFromGitHubUpdated.push(commitAttributes);
                        await this.createOrUpdateCommitWithRetry(
                            commitAttributes
                        );
                    }

                    await this.compareCommitsFromDatabaseAndGitHubAndDetectMissingOnGitHub(
                        repository.name!,
                        branch.name,
                        allCommitsFromGitHubUpdated,
                        allCommitsFromDatabase
                    );
                }
            }

            logger.info("Commits fetched and created successfully!");
        } catch (error) {
            logger.error("Error fetching or creating commits:", { error });
            throw error;
        }
    }

    private async compareCommitsFromDatabaseAndGitHubAndDetectMissingOnGitHub(
        repositoryName: string,
        branchName: string,
        commitsFromGitHub: ICommitAttributes[],
        commitsFromDatabase: ICommitAttributes[]
    ): Promise<void> {
        const commitsFromGitHubSha = commitsFromGitHub.map(
            (commit) => commit.sha
        );
        const commitsFromDatabaseSha = commitsFromDatabase.map(
            (commit) => commit.sha!
        );

        const missingCommitsSha = commitsFromDatabaseSha.filter(
            (sha) => !commitsFromGitHubSha.includes(sha)
        );

        if (missingCommitsSha.length > 0) {
            logger.warn(
                `There are commits missing on GitHub for repository "${repositoryName}" and branch "${branchName}":`,
                { missingCommitsSha }
            );
            for (const commitSha of missingCommitsSha) {
                const commit = await this.commitService.findOneByFields({
                    sha: commitSha,
                });
                if (commit) {
                    commit.possiblyAffectedByForcePush = true;
                    const newCommitAttributes = {
                        branchId: commit.branchId,
                        contributorId: commit.contributorId,
                        sha: commit.sha,
                        message: commit.message,
                        committedDate: commit.committedDate,
                        possiblyAffectedByForcePush: true,
                    };
                    await this.commitService.createOrUpdate(
                        newCommitAttributes
                    );
                }
            }
        }
    }

    private async fetchCommitsFromBranchWithRetry(
        repositoryName: string,
        branchName: string
    ): Promise<CommitGitHub[]> {
        return await this.fetchUtil.retry<CommitGitHub[]>(async () => {
            return await this.gitHubCommitService.getAllCommitsFromBranch(
                repositoryName,
                branchName
            );
        }, `Error fetching commits for repository "${repositoryName}" and branch "${branchName}"`);
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
        const cacheKey = contributorAttributes.githubLogin!.toLowerCase();

        // Check if contributor is already in the cache
        if (this.contributorCache[cacheKey]) {
            return this.contributorCache[cacheKey];
        }

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

    private mapCommitAttributes(
        branchId: number,
        commitData: CommitGitHub,
        authorContributorId?: number | null
    ): ICommitAttributes {
        const commitedDate =
            commitData.commit.author && commitData.commit.author.date
                ? new Date(commitData.commit.author.date)
                : commitData.commit.committer &&
                  commitData.commit.committer.date
                ? new Date(commitData.commit.committer.date)
                : new Date();
        const commitAttributes = {
            branchId: branchId,
            contributorId: authorContributorId,
            githubId: commitData.sha,
            sha: commitData.sha,
            message: commitData.commit.message,
            committedDate: commitedDate,
            possiblyAffectedByForcePush: undefined,
        };
        this.commitCache.set(commitData.sha, commitAttributes);
        return commitAttributes;
    }

    private async createOrUpdateCommitWithRetry(
        commitAttributes: ICommitAttributes
    ): Promise<ICommitAttributes> {
        return await this.fetchUtil.retry<ICommitAttributes>(async () => {
            return await this.commitService.createOrUpdate(commitAttributes);
        }, `Error creating or updating commit "${commitAttributes.sha}"`);
    }
}

export { CommitFetcher };
