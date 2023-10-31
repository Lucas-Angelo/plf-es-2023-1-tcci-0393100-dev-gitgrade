import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { JobExecutor } from "../job/JobExecutor";
import { RepositoryService } from "./RepositoryService";

export class SyncService {
    private jobExecutor: JobExecutor;
    private repositoryService: RepositoryService;

    constructor() {
        this.jobExecutor = new JobExecutor();
        this.repositoryService = new RepositoryService();
    }

    async sync(repositoryIdList: number[]) {
        try {
            logger.info("Starting sync...", repositoryIdList);

            if (repositoryIdList.length === 0) {
                throw new AppError("No repositoryId provided", 400);
            }
            const notFoundRepositories: Array<number> = [];

            for (const repositoryId of repositoryIdList) {
                const repository = await this.repositoryService.findOneByField(
                    "id",
                    repositoryId
                );
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

            const startTime = new Date();

            // cannot have an await because the request should be returned immediately
            this.jobExecutor.runFetchers(repositoryIdList);

            const endTime = new Date();
            logger.info("Sync finished successfully!", {
                startTime,
                endTime,
            });

            return {
                success: true,
            };
        } catch (error) {
            logger.error("Error on sync:", { error });
            throw error;
        }
    }
}
