import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryDTO,
} from "@gitgrade/dtos";
import {
    Controller,
    Get,
    Queries,
    Route,
    Security,
    SuccessResponse,
    Tags,
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
    ): Promise<PaginationResponseDTO<RepositoryDTO>> {
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
}
