import { Controller, Route, Security, Tags, Query, Patch, Request } from "tsoa";
import type { Request as ExpressRequest } from "express";
import { SyncService } from "../service/SyncService";

@Route("sync")
@Tags("sync")
@Security("bearer", ["admin"])
export class SyncController extends Controller {
    private syncService: SyncService;
    constructor() {
        super();
        this.syncService = new SyncService();
    }

    @Patch("/")
    sync(@Query() repositoryId: number[], @Request() request: ExpressRequest) {
        this.setStatus(200);

        const bearerToken = request.headers.authorization as string;
        const serviceResponse = this.syncService.sync(
            repositoryId,
            bearerToken
        );

        return serviceResponse;
    }
}
