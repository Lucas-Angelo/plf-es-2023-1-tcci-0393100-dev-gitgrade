import { CommitMetricsDTO } from "@gitgrade/dtos";
import { Get, Query, Route, Security, Tags } from "tsoa";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";
import CommitService from "../service/CommitService";
import FileService from "../service/FileService";

@Route("repository/{repositoryId}/metric")
@Security("bearer", ["admin"])
@Tags("metrics")
export class RepositoryMetricsController {
    commitService: CommitService;
    fileService: FileService;

    constructor() {
        this.commitService = new CommitService();
        this.fileService = new FileService();
    }

    @Get("commit")
    async getCommitMetrics(
        repositoryId: number,
        @Query() branchName?: string
    ): Promise<CommitMetricsDTO> {
        const serviceResponse =
            await this.commitService.getCommitMetricsGroupedByContributor(
                repositoryId,
                branchName ?? "master"
            );
        return new CommitMetricsMapper().toDto(serviceResponse);
    }

    @Get("changes")
    async getChangesMetrics(
        repositoryId: number,
        @Query() branchName?: string
    ) {
        const serviceResponse =
            await this.fileService.getFileChangeMetricsGroupedByContributor(
                repositoryId,
                branchName ?? "master"
            );
        return new FileChangeMetricsMapper().toDto(serviceResponse);
    }
}
