import { Get, Queries, Route, Tags } from "tsoa";
import ContributorService from "../service/ContributorService";
import ContributorMapper from "../mapper/ContributorMapper";
import { GetAllContributorQueryDTO } from "@gitgrade/dtos";

@Route("repository/{repositoryId}/contributor")
@Tags("contributor")
export class ContributorController {
    private contributorService: ContributorService;

    constructor() {
        this.contributorService = new ContributorService();
    }

    @Get("/")
    async findbyRepositoryId(
        repositoryId: number,
        @Queries() query: GetAllContributorQueryDTO
    ) {
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
