import {
    CommitResponseDTO,
    CommitSearchDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import {
    Controller,
    Example,
    Get,
    Queries,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { CommitMapper } from "../mapper/CommitMapper";
import CommitService from "../service/CommitService";

@Route("commit")
@Security("bearer", ["admin"])
@Tags("commit")
export class CommitController extends Controller {
    private commitService: CommitService;
    private commitMapper: CommitMapper;

    constructor() {
        super();
        this.commitService = new CommitService();
        this.commitMapper = new CommitMapper();
    }

    /**
     * Get all Commits with pagination and filter.
     * Can filter by start_date, end_date, and evaluationMethodId.
     * @query query CommitSearchDTO query to filter by start_date, end_date, and evaluationMethodId.
     */
    @Example<PaginationResponseDTO<CommitResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                message: "Commit 1",
                committedDate: new Date("2023-01-01"),
                branch: {
                    id: 1,
                    name: "master",
                    commitAutomaticSynchronization: true,
                    fileAutomaticSynchronization: true,
                    repositoryId: 1,
                },
                sha: "1234567890",
                contributor: {
                    id: 1,
                    githubAvatarUrl:
                        "https://avatars.githubusercontent.com/u/1?v=4",
                    githubLogin: "octocat",
                    githubEmail: "pessoa@email.com",
                    githubName: "Octo Cat",
                },
            },
        ],
    })
    @Get("/")
    @SuccessResponse("200", "Found commits")
    public async getAll(
        @Queries() query: CommitSearchDTO
    ): Promise<PaginationResponseDTO<CommitResponseDTO>> {
        this.setStatus(200);
        const serviceResponse = await this.commitService.findAll(query);
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(this.commitMapper.toDto),
        };
    }
}
