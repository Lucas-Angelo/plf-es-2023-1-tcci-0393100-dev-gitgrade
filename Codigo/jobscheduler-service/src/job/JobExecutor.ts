import logger from "../config/LogConfig";
import { BranchFetcher } from "./fetcher/BranchFetcher";
import { CommitFetcher } from "./fetcher/CommitFetcher";
import { ContributorFetcher } from "./fetcher/ContributorFetcher";
import { FileFetcher } from "./fetcher/FileFetcher";
import { IssueFetcher } from "./fetcher/IssueFetcher";
import { PullRequestFetcher } from "./fetcher/PullRequestFetcher";
import { RepositoryFetcher } from "./fetcher/RepositoryFetcher";

class JobExecutor {
    private repositoryFetcher: RepositoryFetcher;
    private contributorFetcher: ContributorFetcher;
    private issueFetcher: IssueFetcher;
    private pullRequestFetcher: PullRequestFetcher;
    private branchFetcher: BranchFetcher;
    private commitFetcher: CommitFetcher;
    private fileFetcher: FileFetcher;

    constructor() {
        this.repositoryFetcher = new RepositoryFetcher();
        this.contributorFetcher = new ContributorFetcher();
        this.issueFetcher = new IssueFetcher();
        this.pullRequestFetcher = new PullRequestFetcher();
        this.branchFetcher = new BranchFetcher();
        this.commitFetcher = new CommitFetcher();
        this.fileFetcher = new FileFetcher();
    }

    async runFetchers() {
        try {
            logger.info("Starting JobExecutor...");

            const startTime = new Date();

            await this.repositoryFetcher.createOrUpdateRepositories();
            await this.contributorFetcher.fetchContributorsForOrgAndRepositories();
            await this.issueFetcher.fetchIssuesForRepositories();
            await this.pullRequestFetcher.fetchPullRequestsForRepositories();
            await this.branchFetcher.fetchBranchesForRepositories();
            await this.commitFetcher.fetchCommitsForRepositories();
            await this.fileFetcher.fetchFilesForRepositories();

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
