import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import RepositoryService from "./RepositoryService";
import { JobSchedulerSyncService } from "./client/JobSchedulerSyncService";

export class SyncService {
    private repositoryService: RepositoryService;
    private jobSchedulerSyncService: JobSchedulerSyncService;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.jobSchedulerSyncService = new JobSchedulerSyncService();
    }

    async sync(repositoryIdList: number[], token: string) {
        try {
            logger.info("Syncing repositories", { repositoryIdList });
            if (repositoryIdList.length === 0) {
                throw new AppError("No repositoryId provided", 400);
            }
            const notFoundRepositories: Array<number> = [];

            for (const repositoryId of repositoryIdList) {
                const repository =
                    await this.repositoryService.findById(repositoryId);
                if (!repository) {
                    notFoundRepositories.push(repositoryId);
                }
            }

            if (notFoundRepositories.length > 0) {
                throw new AppError(
                    `Repositories not found: ${notFoundRepositories.join(
                        ", "
                    )}`,
                    404
                );
            }
            const serviceResponse = await this.jobSchedulerSyncService.sync(
                repositoryIdList,
                token
            );
            return serviceResponse.data;
        } catch (error) {
            logger.error("Error while syncing", { error });
            throw new AppError("Error while syncing", 500, error);
        }
    }
}
