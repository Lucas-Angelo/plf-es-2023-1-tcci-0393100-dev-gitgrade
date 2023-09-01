import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryDTO,
} from "@gitgrade/dtos";
import { Get, Queries, Route, Security, Tags } from "tsoa";
import { RepositoryMapper } from "../mapper/RepositoryMapper";
import RepositoryService from "../service/RepositoryService";

@Route("repository")
@Security("bearer", ["admin"])
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
}
