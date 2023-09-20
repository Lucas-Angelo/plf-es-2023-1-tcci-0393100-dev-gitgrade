import { Get, Queries, Res, Route, Tags, TsoaResponse } from "tsoa";
import ContributorService from "../service/ContributorService";
import ContributorMapper from "../mapper/ContributorMapper";
import { ErrorResponseDTO, GetAllContributorQueryDTO } from "@gitgrade/dtos";
import RepositoryService from "../service/RepositoryService";

@Route("repository/{repositoryId}/contributor")
@Tags("contributor")
export class ContributorController {
    private contributorService: ContributorService;
    private repositoryService: RepositoryService;

    constructor() {
        this.contributorService = new ContributorService();
        this.repositoryService = new RepositoryService();
    }

    @Get("/")
    async findbyRepositoryId(
        repositoryId: number,
        @Queries() query: GetAllContributorQueryDTO,
        @Res() notFoundResponse: TsoaResponse<404, ErrorResponseDTO>
    ) {
        const repository = await this.repositoryService.findById(repositoryId);

        if (!repository) {
            return notFoundResponse(404, {
                message: "Repository not found",
            });
        }

        const serviceResponse = await this.contributorService.getByRepositoryId(
            repositoryId,
            {
                limit: query.limit || 10,
                page: query.page || 1,
            }
        );
        const mapper = new ContributorMapper();
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        };
    }
}
