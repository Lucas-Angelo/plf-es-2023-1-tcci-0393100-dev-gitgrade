import {
    Body,
    Controller,
    Get,
    Patch,
    Queries,
    Route,
    Security,
    Tags,
} from "tsoa";
import BranchService from "../service/BranchService";
import { GetAllBranchQueryDTO } from "@gitgrade/dtos";
import { BranchMapper } from "../mapper/BranchMapper";
import { BranchPatchDTO } from "@gitgrade/dtos/dto/branch";

@Security("bearer", ["admin"])
@Route("repository/{repositoryId}/branch")
@Tags("branch")
export class BranchController extends Controller {
    private branchService: BranchService;
    private branchMapper: BranchMapper;

    constructor() {
        super();

        this.branchService = new BranchService();
        this.branchMapper = new BranchMapper();
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

        this.setStatus(200);

        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(this.branchMapper.toDto),
        };
    }

    @Patch("/{id}")
    async patch(
        repositoryId: number,
        id: number,
        @Body() body: BranchPatchDTO
    ) {
        const serviceResponse = await this.branchService.patch(
            repositoryId,
            id,
            body
        );

        this.setStatus(200);

        return this.branchMapper.toDto(serviceResponse);
    }
}
