import { CommitMetricsDTO } from "@gitgrade/dtos";
import {
    Controller,
    Get,
    Query,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";
import CommitService from "../service/CommitService";
import FileService from "../service/FileService";

@Route("repository/{repositoryId}/metric")
@Security("bearer", ["admin"])
@Tags("metrics")
export class RepositoryMetricsController extends Controller {
    commitService: CommitService;
    fileService: FileService;

    constructor() {
        super();
        this.commitService = new CommitService();
        this.fileService = new FileService();
    }

    @Get("commit")
    @SuccessResponse("200", "Commit metrics")
    async getCommitMetrics(
        repositoryId: number,
        @Query() branchName?: string
    ): Promise<CommitMetricsDTO> {
        this.setStatus(200);
        const serviceResponse =
            await this.commitService.getCommitMetricsGroupedByContributor(
                repositoryId,
                branchName ?? "master"
            );
        return new CommitMetricsMapper().toDto(serviceResponse);
    }

    @Get("changes")
    @SuccessResponse("200", "File change metrics")
    async getChangesMetrics(
        repositoryId: number,
        @Query() branchName?: string
    ) {
        this.setStatus(200);
        const serviceResponse =
            await this.fileService.getFileChangeMetricsGroupedByContributor(
                repositoryId,
                branchName ?? "master"
            );
        return new FileChangeMetricsMapper().toDto(serviceResponse);
    }
}
