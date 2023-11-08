import { Controller, Route, Security, Tags, Query, Patch, Request } from "tsoa";
import type { Request as ExpressRequest } from "express";
import { SyncService } from "../service/SyncService";
import { RepositoryMapper } from "../mapper/RepositoryMapper";

@Route("sync")
@Tags("sync")
@Security("bearer", ["admin"])
export class SyncController extends Controller {
    private syncService: SyncService;
    private repositoryMapper: RepositoryMapper;

    constructor() {
        super();
        this.syncService = new SyncService();
        this.repositoryMapper = new RepositoryMapper();
    }

    @Patch("/")
    async sync(
        @Query() repositoryId: number[],
        @Request() request: ExpressRequest
    ) {
        this.setStatus(200);

        const bearerToken = request.headers.authorization as string;
        const serviceResponse = await this.syncService.sync(
            repositoryId,
            bearerToken
        );

        return serviceResponse.map(this.repositoryMapper.toDto);
    }
}
