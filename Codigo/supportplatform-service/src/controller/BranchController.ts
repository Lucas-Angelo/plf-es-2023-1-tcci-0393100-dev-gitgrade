import { Get, Queries, Res, Route, Tags, TsoaResponse } from "tsoa";
import BranchService from "../service/BranchService";
import { ErrorResponseDTO, GetAllBranchQueryDTO } from "@gitgrade/dtos";
import { BranchMapper } from "../mapper/BranchMapper";
import RepositoryService from "../service/RepositoryService";

@Route("repository/{repositoryId}/branch")
@Tags("branch")
export class BranchController {
    private repositoryService: RepositoryService;
    private branchService: BranchService;

    constructor() {
        this.branchService = new BranchService();
        this.repositoryService = new RepositoryService();
    }
    @Get("/")
    async getByRepositoryId(
        repositoryId: number,
        @Queries() query: GetAllBranchQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>
    ) {
        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            return notFoundResponse(404, {
                message: "Repository not found",
            });
        }

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
