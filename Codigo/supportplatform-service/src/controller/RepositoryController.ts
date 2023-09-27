import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryResponseDTO,
    RepositoryPatchDTO,
} from "@gitgrade/dtos";
import {
    Body,
    Controller,
    Example,
    Get,
    Patch,
    Path,
    Queries,
    Res,
    Route,
    Security,
    SuccessResponse,
    Tags,
    TsoaResponse,
} from "tsoa";
import { RepositoryMapper } from "../mapper/RepositoryMapper";
import RepositoryService from "../service/RepositoryService";

@Route("repository")
@Security("bearer", ["admin"])
@Tags("repository")
export class RepositoryController extends Controller {
    private repositoryService: RepositoryService;

    constructor() {
        super();
        this.repositoryService = new RepositoryService();
    }

    @Get("/")
    @SuccessResponse("200", "Found repositories")
    public async getAll(
        @Queries() query: GetAllRepositoryQueryDTO
    ): Promise<PaginationResponseDTO<RepositoryResponseDTO>> {
        this.setStatus(200);
        const serviceResponse = await this.repositoryService.findAll({
            limit: query.limit ?? 10,
            page: query.page ?? 1,
            filter: query.filter,
        });
        const mapper = new RepositoryMapper();
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        };
    }

    /**
     * @param id @isInt id id must be an integer
     * @param id @minimum id 1 id must be greater than or equal to 1
     */
    @Get("/{id}")
    public async getById(
        id: number,
        @Res() notFoundResponse: TsoaResponse<404, { message: string }>
    ): Promise<RepositoryResponseDTO> {
        const serviceResponse = await this.repositoryService.findById(id);

        if (!serviceResponse) {
            return notFoundResponse(404, { message: "Repository not found" });
        }
        const mapper = new RepositoryMapper();
        return mapper.toDto(serviceResponse);
    }

    /*
     * Update a repository.
     * @param id Id of the repository to update.
     * @param body Body of the request.
     * @returns The updated repository.
     */
    @Example<RepositoryResponseDTO>({
        id: 1,
        evaluationMethod: {
            id: 1,
            description: "First evaluation method description",
            semester: 1,
            year: 2023,
            disabledAt: null,
        },
        githubId: "123456",
        name: "First repository",
        description: "First repository description",
        stargazerCount: 0,
        forkCount: 0,
        githubCreatedAt: new Date("2023-09-01T00:00:00.000Z"),
        githubUpdatedAt: new Date("2023-09-01T00:00:00.000Z"),
        hasProjectsEnabled: false,
        hasIssuesEnabled: false,
        primaryLanguage: "JavaScript",
        licenseName: "MIT",
        defaultBranch: "main",
        automaticSynchronization: true,
        synchronizing: false,
        lastSyncAt: new Date("2023-09-01T00:00:00.000Z"),
    })
    @Patch("/{id}")
    @SuccessResponse("200", "Updated evaluation method")
    public async patch(
        @Path() id: number,
        @Body() body: RepositoryPatchDTO
    ): Promise<RepositoryResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.repositoryService.patch(id, body);
        const mapper = new RepositoryMapper();
        return mapper.toDto(serviceResponse);
    }
}
