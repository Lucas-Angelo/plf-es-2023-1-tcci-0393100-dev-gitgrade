import {
    EvaluationMethodCreateDTO,
    EvaluationMethodResponseDTO,
    EvaluationMethodSearchDTO,
    EvaluationMethodUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import {
    Body,
    Controller,
    Delete,
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
import { EvaluationMethodMapper } from "../mapper/EvaluationMethodMapper";
import EvaluationMethodService from "../service/EvaluationMethodService";

@Route("evaluation-method")
@Security("bearer", ["admin"])
@Tags("evaluation-method")
export class EvaluationMethodController extends Controller {
    private evaluationMethodService: EvaluationMethodService;

    constructor() {
        super();
        this.evaluationMethodService = new EvaluationMethodService();
    }
    /**
     * Create a new EvaluationMethod.
     * @body body EvaluationMethodCreateDTO data to create.
     */
    @Example<EvaluationMethodResponseDTO>({
        id: 1,
        description: "First evaluation method",
        semester: 2,
        year: 2023,
        disabledAt: null,
    })
    @Post("/")
    @SuccessResponse("201", "EvaluationMethod created")
    public async create(
        @Body() body: EvaluationMethodCreateDTO
    ): Promise<EvaluationMethodResponseDTO> {
        this.setStatus(201);
        const serviceResponse = await this.evaluationMethodService.create(body);
        const mapper = new EvaluationMethodMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Update an existing EvaluationMethod by id.
     * Need body with all fields.
     * @path id Id of the EvaluationMethod to update.
     * @body body EvaluationMethodUpdateDTO data to update.
     */
    @Example<EvaluationMethodResponseDTO>({
        id: 1,
        description: "First evaluation method",
        semester: 2,
        year: 2023,
        disabledAt: new Date("2023-09-01T00:00:00.000Z"),
    })
    @Put("/{id}")
    @SuccessResponse("200", "EvaluationMethod updated")
    public async update(
        @Path() id: number,
        @Body() body: EvaluationMethodUpdateDTO
    ): Promise<EvaluationMethodResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.evaluationMethodService.update(
            id,
            body
        );
        const mapper = new EvaluationMethodMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Get all EvaluationMethods with pagination and filter.
     * Can filter by description, semester, year and disabledAt.
     * @query query EvaluationMethodSearchDTO query to filter by description, semester, year and disabledAt.
     */
    @Example<PaginationResponseDTO<EvaluationMethodResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                description: "First evaluation method",
                semester: 2,
                year: 2023,
                disabledAt: new Date("2023-09-01T00:00:00.000Z"),
            },
            {
                id: 2,
                description: "Second evaluation method",
                semester: 2,
                year: 2023,
                disabledAt: null,
            },
        ],
    })
    @Get("/")
    @SuccessResponse("200", "Found evaluation methods")
    public async getAll(
        @Queries() query: EvaluationMethodSearchDTO
    ): Promise<PaginationResponseDTO<EvaluationMethodResponseDTO>> {
        this.setStatus(200);
        const serviceResponse =
            await this.evaluationMethodService.findAll(query);
        const mapper = new EvaluationMethodMapper();
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(mapper.toDto),
        };
    }

    /**
     * Get an existing EvaluationMethod by id.
     * @path id Id of the EvaluationMethod to get.
     */
    @Example<EvaluationMethodResponseDTO>({
        id: 1,
        description: "First evaluation method",
        semester: 2,
        year: 2023,
        disabledAt: new Date("2023-09-01T00:00:00.000Z"),
    })
    @Get("/{id}")
    @SuccessResponse("200", "Found evaluation method")
    public async getOne(
        @Path()
        id: number
    ): Promise<EvaluationMethodResponseDTO> {
        this.setStatus(200);
        const serviceResponse = await this.evaluationMethodService.findOneBy({
            id: id,
        });
        const mapper = new EvaluationMethodMapper();
        return mapper.toDto(serviceResponse);
    }

    /**
     * Delete an existing EvaluationMethod by id.
     * @path id Id of the EvaluationMethod to delete.
     */
    @Delete("/{id}")
    @SuccessResponse("204", "EvaluationMethod deleted")
    public async delete(@Path() id: number): Promise<void> {
        this.setStatus(204);
        await this.evaluationMethodService.delete(id);
    }

    /**
     * Clone an existing EvaluationMethod by id.
     * @path id Id of the EvaluationMethod to clone.
     * @return EvaluationMethodResponseDTO The cloned EvaluationMethod.
     */
    @Post("/{id}/clone")
    @SuccessResponse("201", "EvaluationMethod cloned")
    public async clone(
        @Path() id: number
    ): Promise<EvaluationMethodResponseDTO> {
        this.setStatus(201);
        const serviceResponse = await this.evaluationMethodService.clone(id);
        const mapper = new EvaluationMethodMapper();
        return mapper.toDto(serviceResponse);
    }
}
