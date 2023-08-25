import { Get, Query, Route, Tags } from "tsoa";
import CommitService from "../service/CommitService";
import { CommitMetricsDTO } from "@gitgrade/dtos";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import FileService from "../service/FileService";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";

@Route("repository/{repositoryId}/metric")
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
