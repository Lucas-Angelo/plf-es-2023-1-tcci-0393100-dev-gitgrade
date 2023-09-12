import { Get, Queries, Res, Route, Tags, TsoaResponse } from "tsoa";
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

    /**
     * @param id @isInt id id must be an integer
     * @param id @minimum id 1 id must be greater than or equal to 1
     */
    @Get("/{id}")
    public async getById(
        id: number,
        @Res() notFoundResponse: TsoaResponse<404, { message: string }>
    ): Promise<RepositoryDTO> {
        const serviceResponse = await this.repositoryService.findById(id);

        if (!serviceResponse) {
            return notFoundResponse(404, { message: "Repository not found" });
        }

        const mapper = new RepositoryMapper();
        return mapper.toDto(serviceResponse);
    }
}
