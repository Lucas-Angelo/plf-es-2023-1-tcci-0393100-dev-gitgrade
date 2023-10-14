import { Controller, Get, Queries, Route, Security, Tags } from "tsoa";
import ContributorService from "../service/ContributorService";
import ContributorMapper from "../mapper/ContributorMapper";
import { GetAllContributorQueryDTO } from "@gitgrade/dtos";

@Security("bearer", ["admin"])
@Route("repository/{repositoryId}/contributor")
@Tags("contributor")
export class ContributorController extends Controller {
    private contributorService: ContributorService;
    private contributorMapper: ContributorMapper;

    constructor() {
        super();

        this.contributorService = new ContributorService();
        this.contributorMapper = new ContributorMapper();
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

        this.setStatus(200);

        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(this.contributorMapper.toDto),
        };
    }
}
