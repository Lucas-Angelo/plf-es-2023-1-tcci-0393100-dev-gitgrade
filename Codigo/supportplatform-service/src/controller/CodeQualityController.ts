import { CodeQualityResponseDTO } from "@gitgrade/dtos";
import { CodeQualityStatusDto } from "@gitgrade/dtos/dto/codeQuality";
import {
    Controller,
    Example,
    Get,
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
    private codeQualityService;
    private codeQualityMapper: CodeQualityMapper;

    constructor() {
        super();
        this.codeQualityService = CodeQualityService;
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
    @Post("/repository/{repositoryId}")
    @SuccessResponse("201", "Code quality analysis for repository created")
    public async create(
        @Path() repositoryId: number
    ): Promise<CodeQualityResponseDTO> {
        this.setStatus(201);
        const serviceResponse =
            await this.codeQualityService.create(repositoryId);
        return this.codeQualityMapper.toDto(serviceResponse);
    }

    /**
     *     /**
     * Get an existing Sprint by id.
     * @path id Id of the Sprint to get.

    @Example<SprintResponseDTO>({
      id: 1,
      name: "Sprint 1",
      start_date: new Date("2023-01-01"),
      end_date: new Date("2023-01-15"),
      evaluationMethodId: 1,
  })
  @Get("/{id}")
  @SuccessResponse("200", "Found sprint")
  public async getOne(@Path() id: number): Promise<SprintResponseDTO> {
      this.setStatus(200);
      const serviceResponse = await this.sprintService.findOneBy({
          id: id,
      });
      const mapper = new SprintMapper();
      return mapper.toDto(serviceResponse);
  }
     */

    /**
     * Get all CodeQuality by repositoryId.
     * @path repositoryId Id of the repository to get all code quality analysis.
     */
    @Example<CodeQualityResponseDTO[]>([
        {
            id: 1,
            path: "/dashboard?id=repositoryNameTimeStamp",
            repositoryId: 1,
            status: CodeQualityStatusDto.ANALYZING,
            createdAt: new Date("2023-01-01"),
        },
        {
            id: 2,
            path: "/dashboard?id=repositoryNameTimeStamp",
            repositoryId: 1,
            status: CodeQualityStatusDto.ANALYZED,
            createdAt: new Date("2023-01-01"),
        },
        {
            id: 3,
            path: "/dashboard?id=repositoryNameTimeStamp",
            repositoryId: 1,
            status: CodeQualityStatusDto.ERROR,
            createdAt: new Date("2023-01-01"),
        },
    ])
    @Get("/repository/{repositoryId}")
    @SuccessResponse("200", "Found code quality analysis")
    public async getAll(
        @Path() repositoryId: number
    ): Promise<CodeQualityResponseDTO[]> {
        this.setStatus(200);
        const serviceResponse =
            await this.codeQualityService.findAllByRepositoryId(repositoryId);
        return serviceResponse.map(this.codeQualityMapper.toDto);
    }
}
