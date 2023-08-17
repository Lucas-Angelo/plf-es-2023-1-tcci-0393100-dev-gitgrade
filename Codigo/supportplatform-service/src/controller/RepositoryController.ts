import { Get, Queries, Route, Tags } from "tsoa";
import RepositoryService from "../service/RepositoryService";
import { RepositoryMapper } from "../mapper/RepositoryMapper";
import { RepositoryDTO, PaginationResponseDTO, GetAllRepositoryQueryDTO } from "@gitgrade/dtos";
@Route("repository")
@Tags("repository")
export class RepositoryController {
    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
    }

    @Get("/")
    public async getAll(@Queries() query: GetAllRepositoryQueryDTO): Promise<PaginationResponseDTO<RepositoryDTO>> {
        const serviceResponse = await this.repositoryService.findAll(query);
        const mapper = new RepositoryMapper()
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        }
    }
}
