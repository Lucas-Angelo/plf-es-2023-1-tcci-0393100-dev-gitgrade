import logger from "../../config/LogConfig";
import { IBranchAttributes } from "../../model/Branch";
import { BranchService } from "../../service/BranchService";
import { RepositoryService } from "../../service/RepositoryService";
import {
    BranchGitHub,
    GitHubBranchService,
} from "../../service/client/GitHubBranchService";
import FetchUtil from "../../util/FetchUtil";

class BranchFetcher {
    private gitHubBranchService: GitHubBranchService;
    private branchService: BranchService;
    private repositoryService: RepositoryService;
    private fetchUtil: FetchUtil;

    constructor() {
        this.gitHubBranchService = new GitHubBranchService();
        this.branchService = new BranchService();
        this.repositoryService = new RepositoryService();
        this.fetchUtil = new FetchUtil();
    }

    async fetchBranchesForRepositories() {
        try {
            logger.info("Starting Branch Fetcher...");
            const repositories = await this.repositoryService.findAll();

            for (const repository of repositories) {
                const branches = await this.fetchBranchesWithRetry(
                    repository.name!
                );

                for (const branchData of branches) {
                    if (!branchData.name || !branchData.commit) continue;

                    const branchAttributes: IBranchAttributes =
                        this.mapBranchAttributes(repository.id!, branchData);
                    await this.createOrUpdateBranchWithRetry(branchAttributes);
                }
            }

            logger.info("Branches fetched and created successfully!");
        } catch (error) {
            logger.error("Error fetching or creating branches:", error);
            throw error;
        }
    }

    private async fetchBranchesWithRetry(
        repositoryName: string
    ): Promise<BranchGitHub[]> {
        return await this.fetchUtil.retry<BranchGitHub[]>(async () => {
            return await this.gitHubBranchService.getAllBranches(
                repositoryName
            );
        }, `Error fetching branches for repository "${repositoryName}"`);
    }

    private mapBranchAttributes(
        repositoryId: number,
        branchData: BranchGitHub
    ): IBranchAttributes {
        return {
            repositoryId: repositoryId,
            name: branchData.name,
        };
    }

    private async createOrUpdateBranchWithRetry(
        branchAttributes: IBranchAttributes
    ): Promise<IBranchAttributes> {
        return await this.fetchUtil.retry<IBranchAttributes>(async () => {
            return await this.branchService.createOrUpdate(branchAttributes);
        }, `Error creating or updating branch "${branchAttributes.name}"`);
    }
}

export { BranchFetcher };
