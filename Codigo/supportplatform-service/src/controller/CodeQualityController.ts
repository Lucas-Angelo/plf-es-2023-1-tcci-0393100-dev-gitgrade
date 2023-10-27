import { CodeQualityResponseDTO } from "@gitgrade/dtos";
import { CodeQualityStatusDto } from "@gitgrade/dtos/dto/codeQuality";
import {
    Controller,
    Example,
    Path,
    Post,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { CodeQualityMapper } from "../mapper/CodeQualityMapper";
import CodeQualityService from "../service/CodeQualityService";

@Route("code-quality")
@Security("bearer", ["admin"])
@Tags("code-quality")
export class CodeQualityController extends Controller {
    private codeQualityService: CodeQualityService;
    private codeQualityMapper: CodeQualityMapper;

    constructor() {
        super();
        this.codeQualityService = new CodeQualityService();
        this.codeQualityMapper = new CodeQualityMapper();
    }

    /**
     * Create a code quality analysis for a repository.
     * @path repositoryId Id of the repository to create a code quality analysis.
     */
    @Example<CodeQualityResponseDTO>({
        id: 1,
        path: "/dashboard?id=repositoryNameTimeStamp",
        repositoryId: 1,
        status: CodeQualityStatusDto.ANALYZING,
        createdAt: new Date("2023-01-01"),
    })
    @Post("/{repositoryId}")
    @SuccessResponse("201", "Code quality analysis for repository created")
    public async create(
        @Path() repositoryId: number
    ): Promise<CodeQualityResponseDTO> {
        this.setStatus(201);
        const serviceResponse =
            await this.codeQualityService.create(repositoryId);
        return this.codeQualityMapper.toDto(serviceResponse);
    }
}
