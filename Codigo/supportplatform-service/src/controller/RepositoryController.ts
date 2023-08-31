import { Get, Queries, Route, Tags } from "tsoa";
import RepositoryService from "../service/RepositoryService";
import { RepositoryMapper } from "../mapper/RepositoryMapper";
import {
    RepositoryDTO,
    PaginationResponseDTO,
    GetAllRepositoryQueryDTO,
} from "@gitgrade/dtos";

@Route("repository")
@Tags("repository")
export class RepositoryController {
    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
    }

    @Get("/")
    public async getAll(
        @Queries() query: GetAllRepositoryQueryDTO
    ): Promise<PaginationResponseDTO<RepositoryDTO>> {
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

    @Get("/{id}")
    public async getById(id: number): Promise<RepositoryDTO> {
        const serviceResponse = await this.repositoryService.findById(id);
        const mapper = new RepositoryMapper();
        return mapper.toDto(serviceResponse);
    }
}
