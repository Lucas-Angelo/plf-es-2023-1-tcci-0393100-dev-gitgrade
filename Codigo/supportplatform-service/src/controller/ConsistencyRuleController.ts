import {
    ConsistencyRuleCreateDTO,
    ConsistencyRuleResponseDTO,
    ConsistencyRuleSearchDTO,
    ConsistencyRuleUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";
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
import { ConsistencyRuleMapper } from "../mapper/ConsistencyRuleMapper";
import ConsistencyRuleService from "../service/ConsistencyRuleService";

@Route("consistency-rule")
@Security("bearer", ["admin"])
@Tags("consistency-rule")
export class ConsistencyRuleController extends Controller {
    private consistencyRuleService: ConsistencyRuleService;
    private consistencyRuleMapper: ConsistencyRuleMapper;

    constructor() {
        super();
        this.consistencyRuleService = new ConsistencyRuleService();
        this.consistencyRuleMapper = new ConsistencyRuleMapper();
    }

    /**
     * Create a new ConsistencyRule.
     * @body body ConsistencyRuleCreateDTO data to create.
     */
    @Example<ConsistencyRuleResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        sprintId: 1,
        standardizedIssueId: 1,
        description: "ConsistencyRule 1 description",
        filePath: "/Documentacao/DocumentoDoProjeto.pdf",
        validationType: ValidationType.DEFAULT,
    })
    @Post("/")
    @SuccessResponse("201", "ConsistencyRule created")
    public async create(
        @Body() body: ConsistencyRuleCreateDTO
    ): Promise<ConsistencyRuleResponseDTO> {
        this.setStatus(201);
        const serviceResponse = await this.consistencyRuleService.create(body);
        return this.consistencyRuleMapper.toDto(serviceResponse);
    }

    /**
     * Update an existing ConsistencyRule by id.
     * Need body with all fields.
     * @path id Id of the ConsistencyRule to update.
     * @body body ConsistencyRuleUpdateDTO data to update.
     */
    @Example<ConsistencyRuleResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        sprintId: 1,
        standardizedIssueId: 1,
        description: "ConsistencyRule 1 description",
        filePath: "/Documentacao/DocumentoDoProjeto.pdf",
        validationType: ValidationType.DEFAULT,
    })
    @Put("/{id}")
    @SuccessResponse("200", "ConsistencyRule updated")
    public async update(
        @Path() id: number,
        @Body() body: ConsistencyRuleUpdateDTO
    ): Promise<ConsistencyRuleResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.consistencyRuleService.update(
            id,
            body
        );
        return this.consistencyRuleMapper.toDto(serviceResponse);
    }

    /**
     * Get all ConsistencyRules with pagination and filter.
     * @query query ConsistencyRuleSearchDTO query to filter.
     */
    @Example<PaginationResponseDTO<ConsistencyRuleResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                evaluationMethodId: 1,
                sprintId: 1,
                standardizedIssueId: 1,
                description: "ConsistencyRule 1 description",
                filePath: "/Documentacao/DocumentoDoProjeto.pdf",
                validationType: ValidationType.DEFAULT,
            },
            {
                id: 2,
                evaluationMethodId: 1,
                sprintId: 1,
                standardizedIssueId: 1,
                description: "ConsistencyRule 2 description",
                filePath: "CITATION.cff",
                validationType: ValidationType.CFF,
            },
        ],
    })
    @Get("/")
    @SuccessResponse("200", "Found consistency rules")
    public async getAll(
        @Queries() query: ConsistencyRuleSearchDTO
    ): Promise<PaginationResponseDTO<ConsistencyRuleResponseDTO>> {
        this.setStatus(200);
        const serviceResponse =
            await this.consistencyRuleService.findAll(query);
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(
                this.consistencyRuleMapper.toDto
            ),
        };
    }

    /**
     * Get an existing ConsistencyRule by id.
     * @path id Id of the ConsistencyRule to get.
     */
    @Example<ConsistencyRuleResponseDTO>({
        id: 1,
        evaluationMethodId: 1,
        sprintId: 1,
        standardizedIssueId: 1,
        description: "ConsistencyRule 1 description",
        filePath: "/Documentacao/DocumentoDoProjeto.pdf",
        validationType: ValidationType.DEFAULT,
    })
    @Get("/{id}")
    @SuccessResponse("200", "Found consistency rule")
    public async getOne(
        @Path() id: number
    ): Promise<ConsistencyRuleResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.consistencyRuleService.findOneBy({
            id: id,
        });
        return this.consistencyRuleMapper.toDto(serviceResponse);
    }
}
