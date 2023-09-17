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
     * @body body SprintCreateDTO data to create.
     */
    @Example<SprintResponseDTO>({
        id: 1,
        name: "Sprint 1",
        start_date: new Date("2023-01-01"),
        end_date: new Date("2023-01-15"),
        evaluationMethodId: 1,
    })
    @Post("/")
    @SuccessResponse("201", "Sprint created")
    public async create(
        @Body() body: SprintCreateDTO
    ): Promise<SprintResponseDTO> {
        this.setStatus(201);
        const serviceResponse = await this.sprintService.create(body);
        const mapper = new SprintMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Update an existing Sprint by id.
     * Need body with all fields.
     * @path id Id of the Sprint to update.
     * @body body SprintUpdateDTO data to update.
     */
    @Example<SprintResponseDTO>({
        id: 1,
        name: "Sprint 1",
        start_date: new Date("2023-01-01"),
        end_date: new Date("2023-01-15"),
        evaluationMethodId: 1,
    })
    @Put("/{id}")
    @SuccessResponse("200", "Sprint updated")
    public async update(
        @Path() id: number,
        @Body() body: SprintUpdateDTO
    ): Promise<SprintResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.sprintService.update(id, body);
        const mapper = new SprintMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Get all Sprints with pagination and filter.
     * Can filter by start_date, end_date, and evaluationMethodId.
     * @query query SprintSearchDTO query to filter by start_date, end_date, and evaluationMethodId.
     */
    @Example<PaginationResponseDTO<SprintResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                name: "Sprint 1",
                start_date: new Date("2023-01-01"),
                end_date: new Date("2023-01-15"),
                evaluationMethodId: 1,
            },
        ],
    })
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
}
