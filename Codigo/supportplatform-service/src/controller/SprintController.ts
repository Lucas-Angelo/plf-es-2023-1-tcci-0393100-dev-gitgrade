import {
    PaginationResponseDTO,
    SprintCreateDTO,
    SprintResponseDTO,
    SprintSearchDTO,
    SprintUpdateDTO,
} from "@gitgrade/dtos";
import {
    Body,
    Controller,
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
import { SprintMapper } from "../mapper/SprintMapper";
import SprintService from "../service/SprintService";

@Route("sprint")
@Security("bearer", ["admin"])
@Tags("sprint")
export class SprintController extends Controller {
    private sprintService: SprintService;

    constructor() {
        super();
        this.sprintService = new SprintService();
    }

    /**
     * Create a new Sprint.
     * @body requestBody SprintCreateDTO data to create.
     */
    @Post("/")
    @SuccessResponse("201", "Sprint created")
    public async create(
        @Body() requestBody: SprintCreateDTO
    ): Promise<SprintResponseDTO> {
        this.setStatus(201);
        const serviceResponse = await this.sprintService.create(requestBody);
        const mapper = new SprintMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Update an existing Sprint by id.
     * Need body with all fields.
     * @path id Id of the Sprint to update.
     * @body requestBody SprintUpdateDTO data to update.
     */
    @Put("/{id}")
    @SuccessResponse("200", "Sprint updated")
    public async update(
        @Path() id: number,
        @Body() requestBody: SprintUpdateDTO
    ): Promise<SprintResponseDTO | null> {
        this.setStatus(200);
        const serviceResponse = await this.sprintService.update(
            id,
            requestBody
        );
        if (!serviceResponse) return null;
        const mapper = new SprintMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Get all Sprints with pagination and filter.
     * Can filter by start_date, end_date, and evaluation_method_id.
     * @query query SprintSearchDTO query to filter by start_date, end_date, and evaluation_method_id.
     */
    @Get("/")
    @SuccessResponse("200", "Found sprints")
    public async getAll(
        @Queries() query: SprintSearchDTO
    ): Promise<PaginationResponseDTO<SprintResponseDTO>> {
        this.setStatus(200);
        const serviceResponse = await this.sprintService.findAll(query);
        const mapper = new SprintMapper();
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        };
    }

    /**
     * Get an existing Sprint by id.
     * @path id Id of the Sprint to get.
     */
    @Get("/{id}")
    @SuccessResponse("200", "Found sprint")
    public async getOne(@Path() id: number): Promise<SprintResponseDTO | null> {
        this.setStatus(200);
        const serviceResponse = await this.sprintService.findOne({ id });
        if (!serviceResponse) return null;
        const mapper = new SprintMapper();
        return mapper.toDto(serviceResponse);
    }
}
