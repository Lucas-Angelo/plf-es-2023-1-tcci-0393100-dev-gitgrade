import { Route, Patch, Controller, Security, Tags, Query } from "tsoa";
import AppError from "../error/AppError";
import logger from "../config/LogConfig";
import { SyncService } from "../service/SyncService";

@Route("sync")
@Tags("sync")
@Security("bearer", [])
export class SyncController extends Controller {
    private syncService: SyncService;

    constructor() {
        super();
        this.syncService = new SyncService();
    }

    @Patch("/")
    syncRepositories(@Query() repositoryId: number[]) {
        try {
            logger.info("Dispatching sync...", {
                repositoryIdList: repositoryId,
            });
            return this.syncService.sync(repositoryId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Error on sync", 500, error);
        }
    }
}
