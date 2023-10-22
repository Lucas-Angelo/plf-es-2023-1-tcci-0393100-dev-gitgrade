import logger from "../config/LogConfig";
import { RepositoryService } from "../service/RepositoryService";
import { BranchFetcher } from "./fetcher/BranchFetcher";
import { CommitFetcher } from "./fetcher/CommitFetcher";
import { ContributorFetcher } from "./fetcher/ContributorFetcher";
import { FileFetcher } from "./fetcher/FileFetcher";
import { IssueFetcher } from "./fetcher/IssueFetcher";
import { PullRequestFetcher } from "./fetcher/PullRequestFetcher";
import { RepositoryFetcher } from "./fetcher/RepositoryFetcher";
import { ConsistencyRuleDeliverySynchronizer } from "./synchronizer/ConsistencyRuleDeliverySynchronizer";

class JobExecutor {
    private repositoryService: RepositoryService;

    private repositoryFetcher: RepositoryFetcher;
    private contributorFetcher: ContributorFetcher;
    private issueFetcher: IssueFetcher;
    private pullRequestFetcher: PullRequestFetcher;
    private branchFetcher: BranchFetcher;
    private commitFetcher: CommitFetcher;
    private fileFetcher: FileFetcher;

    private consistencyRuleDeliverySynchronizer: ConsistencyRuleDeliverySynchronizer;

    constructor() {
        this.repositoryService = new RepositoryService();

        this.repositoryFetcher = new RepositoryFetcher();
        this.contributorFetcher = new ContributorFetcher();
        this.issueFetcher = new IssueFetcher();
        this.pullRequestFetcher = new PullRequestFetcher();
        this.branchFetcher = new BranchFetcher();
        this.commitFetcher = new CommitFetcher();
        this.fileFetcher = new FileFetcher();

        this.consistencyRuleDeliverySynchronizer =
            new ConsistencyRuleDeliverySynchronizer();
    }

    async runFetchers() {
        try {
            logger.info("Starting JobExecutor...");

            const startTime = new Date();

            const repositoriesSyncing =
                await this.repositoryService.setAllAutomaticSynchronizationEnableRepositoriesToSynchronizingTrue();

            await this.repositoryFetcher.createOrUpdateRepositories();
            await this.contributorFetcher.fetchContributorsForOrgAndRepositories();
            await this.issueFetcher.fetchIssuesForRepositories();
            await this.pullRequestFetcher.fetchPullRequestsForRepositories();
            await this.branchFetcher.fetchBranchesForRepositories();
            await this.commitFetcher.fetchCommitsForRepositories();
            await this.fileFetcher.fetchFilesForRepositories();

            await this.consistencyRuleDeliverySynchronizer.syncConsistencyRuleDeliveriesAndStdIssues();

            await this.repositoryService.setAllRepositoriesToSynchronizingFalse(
                repositoriesSyncing
            );

            const endTime = new Date();
            const executionTime = endTime.getTime() - startTime.getTime();

            logger.info(
                `Fetchers executed successfully! Total execution time: ${executionTime}ms (Minutes: ${
                    executionTime / 1000 / 60
                }))`
            );
        } catch (error) {
            logger.error("Error executing fetchers:", { error });
            throw error;
        }
    }
}

export { JobExecutor };
