import {
    PaginationResponseDTO,
    StandardizedIssueCreateDTO,
    StandardizedIssueResponseDTO,
    StandardizedIssueSearchDTO,
    StandardizedIssueUpdateDTO,
} from "@gitgrade/dtos";
import {
    Body,
    Controller,
    Example,
    Get,
    Path,
    Post,
    Put,
    Queries,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { StandardizedIssueMapper } from "../mapper/StandardizedIssueMapper";
import StandardizedIssueService from "../service/StandardizedIssueService";

@Route("standardized-issue")
@Security("bearer", ["admin"])
@Tags("standardized-issue")
export class StandardizedIssueController extends Controller {
    private standardizedIssueService: StandardizedIssueService;
    private standardizedIssueMapper: StandardizedIssueMapper;

    constructor() {
        super();
        this.standardizedIssueService = new StandardizedIssueService();
        this.standardizedIssueMapper = new StandardizedIssueMapper();
    }

    @Example<StandardizedIssueResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        title: "StandardizedIssue 1 title",
        description: "StandardizedIssue 1 description",
    })
    @Post("/")
    @SuccessResponse("201", "StandardizedIssue created")
    public async create(
        @Body() body: StandardizedIssueCreateDTO
    ): Promise<StandardizedIssueResponseDTO> {
        this.setStatus(201);
        const serviceResponse =
            await this.standardizedIssueService.create(body);
        return this.standardizedIssueMapper.toDto(serviceResponse);
    }

    @Example<StandardizedIssueResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        title: "StandardizedIssue 1 title",
        description: "StandardizedIssue 1 description",
    })
    @Put("/{id}")
    @SuccessResponse("200", "StandardizedIssue updated")
    public async update(
        @Path() id: number,
        @Body() body: StandardizedIssueUpdateDTO
    ): Promise<StandardizedIssueResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.standardizedIssueService.update(
            id,
            body
        );
        return this.standardizedIssueMapper.toDto(serviceResponse);
    }

    @Example<PaginationResponseDTO<StandardizedIssueResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                evaluationMethodId: 1,
                title: "StandardizedIssue 1 title",
                description: "StandardizedIssue 1 description",
            },
        ],
    })
    @Get("/")
    @SuccessResponse("200", "Found standardized issues")
    public async getAll(
        @Queries() query: StandardizedIssueSearchDTO
    ): Promise<PaginationResponseDTO<StandardizedIssueResponseDTO>> {
        this.setStatus(200);
        const serviceResponse =
            await this.standardizedIssueService.findAll(query);
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(
                this.standardizedIssueMapper.toDto
            ),
        };
    }

    @Example<StandardizedIssueResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        title: "StandardizedIssue 1 title",
        description: "StandardizedIssue 1 description",
    })
    @Get("/{id}")
    @SuccessResponse("200", "Found standardized issue")
    public async getOne(
        @Path() id: number
    ): Promise<StandardizedIssueResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.standardizedIssueService.findOneBy({
            id: id,
        });
        return this.standardizedIssueMapper.toDto(serviceResponse);
    }
}
