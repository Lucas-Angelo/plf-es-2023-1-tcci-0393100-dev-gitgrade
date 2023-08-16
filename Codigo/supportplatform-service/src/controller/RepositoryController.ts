import { Get, Queries, Route, Tags } from "tsoa";
import RepositoryService from "../service/RepositoryService";
import { RepositoryMapper } from "./RepositoryMapper";
import { PaginationResponse } from "../types/pagination";
import { RepositoryDTO } from "../dto/RepositoryDTO";

interface GetAllRepositoryQuery {
    /**
     * @isInt page must be an integer
     */
    page: number;
    /**
     * @isInt page must be an integer
     */
    limit: number;
    filter?: string
}

interface PingResponse {
    message: string;
}

@Route("repository")
@Tags("repository")
export class RepositoryController {
    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
    }
    @Get("/")
    public async getAll(@Queries() query: GetAllRepositoryQuery): Promise<PaginationResponse<RepositoryDTO>> {
        const serviceResponse = await this.repositoryService.findAll(query);
        const mapper = new RepositoryMapper()
        return {
            totalPages: serviceResponse.totalPages,
            data: serviceResponse.data.map(mapper.toDto),
        }
    }
}
