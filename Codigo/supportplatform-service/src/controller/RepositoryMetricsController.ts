import { Get, Queries, Query, Res, Route, Tags, TsoaResponse } from "tsoa";
import CommitService from "../service/CommitService";
import {
    CommitMetricsDTO,
    CommitMetricsQueryDTO,
    ErrorResponseDTO,
} from "@gitgrade/dtos";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import FileService from "../service/FileService";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";
import RepositoryService from "../service/RepositoryService";
import { isValidDateInterval } from "../utils/date";

@Route("repository/{repositoryId}/metric")
@Tags("metrics")
export class RepositoryMetricsController {
    repositoryService: RepositoryService;
    commitService: CommitService;
    fileService: FileService;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.commitService = new CommitService();
        this.fileService = new FileService();
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("commit")
    async getCommitMetrics(
        repositoryId: number,
        @Queries() query: CommitMetricsQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ): Promise<CommitMetricsDTO> {
        if (
            query.startedAt &&
            query.endedAt &&
            !isValidDateInterval(query.startedAt, query.endedAt)
        ) {
            return unprocessableEntityResponse(422, {
                message: "Invalid date interval",
                details: {
                    "query.startedAt": {
                        message:
                            "startedAt must be less than or equal to endedAt",
                        value: query.startedAt,
                    },
                    "query.endedAt": {
                        message:
                            "endedAt must be greater than or equal to startedAt",
                        value: query.endedAt,
                    },
                },
            });
        }

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            return notFoundResponse(404, {
                message: "Repository not found",
            });
        }

        const branchName =
            query.branchName ?? repository.defaultBranch ?? "master";
        const startedAt =
            query.startedAt ?? new Date(repository.githubCreatedAt);
        const endedAt = query.endedAt ?? new Date();

        const serviceResponse =
            await this.commitService.getCommitMetricsGroupedByContributor(
                repositoryId,
                branchName,
                startedAt,
                endedAt
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
