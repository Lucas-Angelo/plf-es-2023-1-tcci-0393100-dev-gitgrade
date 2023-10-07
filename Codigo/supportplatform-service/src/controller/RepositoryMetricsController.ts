import CommitService from "../service/CommitService";
import {
    CommitMetricsDTO,
    RepositoryMetricQueryDTO,
    ErrorResponseDTO,
    IssueMetricQueryDTO,
    CommitQualityMetricsDTO,
} from "@gitgrade/dtos";
import {
    Controller,
    Get,
    Route,
    Security,
    SuccessResponse,
    Tags,
    Queries,
    Res,
    TsoaResponse,
} from "tsoa";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";
import RepositoryService from "../service/RepositoryService";
import { QueryIntervalValidator } from "../validation/QueryIntervalValidator";
import IssueService from "../service/IssueService";
import { CommitQualityMetricsMapper } from "../mapper/CommitQualityMetricsMapper";
import FileService from "../service/FileService";

@Route("repository/{repositoryId}/metric")
@Security("bearer", ["admin"])
@Tags("metrics")
export class RepositoryMetricsController extends Controller {
    repositoryService: RepositoryService;
    commitService: CommitService;
    fileService: FileService;
    issueService: IssueService;

    constructor() {
        super();
        this.repositoryService = new RepositoryService();
        this.commitService = new CommitService();
        this.fileService = new FileService();
        this.issueService = new IssueService();
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("commit")
    @SuccessResponse("200", "Commit metrics")
    async getCommitMetrics(
        repositoryId: number,
        @Queries() query: RepositoryMetricQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ): Promise<CommitMetricsDTO> {
        const validateQueryInterval = new QueryIntervalValidator(
            unprocessableEntityResponse
        ).validate(query);
        if (validateQueryInterval) return validateQueryInterval;

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
                endedAt,
                query.contributor,
                query.filterWithNoContributor
            );

        this.setStatus(200);
        return new CommitMetricsMapper().toDto(serviceResponse);
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("changes")
    @SuccessResponse("200", "File change metrics")
    async getChangesMetrics(
        repositoryId: number,
        @Queries() query: RepositoryMetricQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ) {
        const validateQueryInterval = new QueryIntervalValidator(
            unprocessableEntityResponse
        ).validate(query);
        if (validateQueryInterval) return validateQueryInterval;

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
            await this.fileService.getFileChangeMetricsGroupedByContributor(
                repositoryId,
                branchName,
                startedAt,
                endedAt,
                query.contributor,
                query.filterWithNoContributor
            );
        this.setStatus(200);
        return new FileChangeMetricsMapper().toDto(serviceResponse);
    }

    @Get("file-types")
    async getFileTypesMetrics(
        repositoryId: number,
        @Queries() query: RepositoryMetricQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ) {
        const validateQueryInterval = new QueryIntervalValidator(
            unprocessableEntityResponse
        ).validate(query);
        if (validateQueryInterval) return validateQueryInterval;

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
            await this.fileService.getFileTypeMetricsGroupedByContributor(
                repositoryId,
                branchName,
                startedAt,
                endedAt,
                query.contributor,
                query.filterWithNoContributor
            );
        return serviceResponse;
    }

    @Get("issues")
    async getIssuesMetrics(
        repositoryId: number,
        @Queries() query: IssueMetricQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ) {
        const validateQueryInterval = new QueryIntervalValidator(
            unprocessableEntityResponse
        ).validate(query);
        if (validateQueryInterval) return validateQueryInterval;

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            return notFoundResponse(404, {
                message: "Repository not found",
            });
        }

        const startedAt =
            query.startedAt ?? new Date(repository.githubCreatedAt);
        const endedAt = query.endedAt ?? new Date();

        const serviceResponse =
            await this.issueService.getIssueMetricsGroupedByContributor(
                repositoryId,
                startedAt,
                endedAt,
                query.contributor
            );
        return serviceResponse;
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("commit-quality")
    async getCommitQualityMetrics(
        repositoryId: number,
        @Queries() query: RepositoryMetricQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>,
        @Res() unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ): Promise<CommitQualityMetricsDTO> {
        const validateQueryInterval = new QueryIntervalValidator(
            unprocessableEntityResponse
        ).validate(query);
        if (validateQueryInterval) return validateQueryInterval;

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
            await this.commitService.getCommitQualityGroupedByContributor(
                repositoryId,
                branchName,
                startedAt,
                endedAt,
                query.contributor
            );
        return new CommitQualityMetricsMapper().toDto(serviceResponse);
    }
}
