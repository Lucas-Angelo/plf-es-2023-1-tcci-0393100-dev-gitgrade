import { Get, Queries, Route, Tags } from "tsoa";
import BranchService from "../service/BranchService";
import { GetAllBranchQueryDTO } from "@gitgrade/dtos";
import { BranchMapper } from "../mapper/BranchMapper";

@Route("repository/{repositoryId}/branch")
@Tags("branch")
export class BranchController {
    private branchService: BranchService;

    constructor() {
        this.branchService = new BranchService();
    }
    @Get("/")
    async getByRepositoryId(
        repositoryId: number,
        @Queries() query: GetAllBranchQueryDTO
    ) {
        const serviceResponse = await this.branchService.getByRepositoryId(
            repositoryId,
            {
                limit: query.limit || 10,
                page: query.page || 1,
            }
        );
        const mapper = new BranchMapper();
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        };
    }
}
