import CommitService from "../service/CommitService";
import {
    CommitMetricsDTO,
    RepositoryMetricQueryDTO,
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
} from "tsoa";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";
import { FileChangeMetricsMapper } from "../mapper/FileChangeMetricsMapper";
import RepositoryService from "../service/RepositoryService";
import { QueryIntervalValidator } from "../validation/QueryIntervalValidator";
import IssueService from "../service/IssueService";
import { CommitQualityMetricsMapper } from "../mapper/CommitQualityMetricsMapper";
import FileService from "../service/FileService";
import AppError from "../error/AppError";

@Route("repository/{repositoryId}/metric")
@Security("bearer", ["admin"])
@Tags("metrics")
export class RepositoryMetricsController extends Controller {
    private repositoryService: RepositoryService;
    private commitService: CommitService;
    private fileService: FileService;
    private issueService: IssueService;

    private commitQualityMetricsMapper: CommitQualityMetricsMapper;
    private commitMetricsMapper: CommitMetricsMapper;
    private fileChangeMetricsMapper: FileChangeMetricsMapper;

    private queryIntervalValidator: QueryIntervalValidator;

    constructor() {
        super();
        this.repositoryService = new RepositoryService();
        this.commitService = new CommitService();
        this.fileService = new FileService();
        this.issueService = new IssueService();

        this.commitQualityMetricsMapper = new CommitQualityMetricsMapper();
        this.commitMetricsMapper = new CommitMetricsMapper();
        this.fileChangeMetricsMapper = new FileChangeMetricsMapper();

        this.queryIntervalValidator = new QueryIntervalValidator();
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
        @Queries() query: RepositoryMetricQueryDTO
    ): Promise<CommitMetricsDTO> {
        this.queryIntervalValidator.validate(query);

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            throw new AppError("Repository not found", 404);
        }

        const branchName = query.branchName ?? repository.defaultBranch!;
        const startedAt = query.startedAt ?? new Date(0);
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
        return this.commitMetricsMapper.toDto(serviceResponse);
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
        @Queries() query: RepositoryMetricQueryDTO
    ) {
        this.queryIntervalValidator.validate(query);

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            throw new AppError("Repository not found", 404);
        }

        const branchName = query.branchName ?? repository.defaultBranch!;
        const startedAt = query.startedAt ?? new Date(0);
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
        return this.fileChangeMetricsMapper.toDto(serviceResponse);
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("file-types")
    async getFileTypesMetrics(
        repositoryId: number,
        @Queries() query: RepositoryMetricQueryDTO
    ) {
        this.queryIntervalValidator.validate(query);

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            throw new AppError("Repository not found", 404);
        }

        const branchName = query.branchName ?? repository.defaultBranch!;
        const startedAt = query.startedAt ?? new Date(0);
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

        this.setStatus(200);
        return serviceResponse;
    }

    /**
     *
     * @param repositoryId
     * @param repositoryId @isInt repositoryId repositoryId must be an integer
     * @param repositoryId @minimum repositoryId 1 repositoryId must be greater than or equal to 1
     */
    @Get("issues")
    async getIssuesMetrics(
        repositoryId: number,
        @Queries() query: IssueMetricQueryDTO
    ) {
        this.queryIntervalValidator.validate(query);

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            throw new AppError("Repository not found", 404);
        }

        const startedAt = query.startedAt ?? new Date(0);
        const endedAt = query.endedAt ?? new Date();

        const serviceResponse =
            await this.issueService.getIssueMetricsGroupedByContributor(
                repositoryId,
                startedAt,
                endedAt,
                query.contributor,
                query.filterWithNoContributor
            );

        this.setStatus(200);
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
        @Queries() query: RepositoryMetricQueryDTO
    ): Promise<CommitQualityMetricsDTO> {
        this.queryIntervalValidator.validate(query);

        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            throw new AppError("Repository not found", 404);
        }

        const branchName = query.branchName ?? repository.defaultBranch!;
        const startedAt = query.startedAt ?? new Date(0);
        const endedAt = query.endedAt ?? new Date();

        const serviceResponse =
            await this.commitService.getCommitQualityGroupedByContributor(
                repositoryId,
                branchName,
                startedAt,
                endedAt,
                query.contributor,
                query.filterWithNoContributor
            );

        this.setStatus(200);
        return this.commitQualityMetricsMapper.toDto(serviceResponse);
    }
}
