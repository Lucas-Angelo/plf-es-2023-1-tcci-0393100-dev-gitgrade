import {
    ConsistencyRuleDeliveryCreateDTO,
    ConsistencyRuleDeliveryResponseDTO,
    ConsistencyRuleDeliverySearchDTO,
    ConsistencyRuleDeliveryUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";
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
import { ConsistencyRuleDeliveryMapper } from "../mapper/ConsistencyRuleDeliveryMapper";
import ConsistencyRuleDeliveryService from "../service/ConsistencyRuleDeliveryService";

@Route("consistency-rule-delivery")
@Security("bearer", ["admin"])
@Tags("ConsistencyRuleDelivery")
export class ConsistencyRuleDeliveryController extends Controller {
    private consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;
    private consistencyRuleDeliveryMapper: ConsistencyRuleDeliveryMapper;

    constructor() {
        super();
        this.consistencyRuleDeliveryService =
            new ConsistencyRuleDeliveryService();
        this.consistencyRuleDeliveryMapper =
            new ConsistencyRuleDeliveryMapper();
    }

    /**
     * Create a new ConsistencyRuleDelivery.
     * @body body ConsistencyRuleDeliveryCreateDTO data to create.
     */
    @Example<ConsistencyRuleDeliveryResponseDTO>({
        id: 1,
        consistencyRuleId: 1,
        repositoryId: 1,
        deliveryAt: new Date("2023-01-01"),
        status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
    })
    @Post("/")
    @SuccessResponse("201", "ConsistencyRuleDelivery created")
    public async create(
        @Body() body: ConsistencyRuleDeliveryCreateDTO
    ): Promise<ConsistencyRuleDeliveryResponseDTO> {
        this.setStatus(201);
        const serviceResponse =
            await this.consistencyRuleDeliveryService.create(body);
        return this.consistencyRuleDeliveryMapper.toDto(serviceResponse);
    }

    /**
     * Update an existing ConsistencyRuleDelivery by id.
     * Need body with all fields.
     * @path id Id of the ConsistencyRuleDelivery to update.
     * @body body ConsistencyRuleDeliveryUpdateDTO data to update.
     */
    @Example<ConsistencyRuleDeliveryResponseDTO>({
        id: 1,
        consistencyRuleId: 1,
        repositoryId: 1,
        deliveryAt: new Date("2023-01-02"),
        status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
    })
    @Put("/{id}")
    @SuccessResponse("200", "ConsistencyRuleDelivery updated")
    public async update(
        @Path() id: number,
        @Body() body: ConsistencyRuleDeliveryUpdateDTO
    ): Promise<ConsistencyRuleDeliveryResponseDTO> {
        this.setStatus(200);
        const serviceResponse =
            await this.consistencyRuleDeliveryService.update(id, body);
        return this.consistencyRuleDeliveryMapper.toDto(serviceResponse);
    }

    /**
     * Get all ConsistencyRuleDeliveries with pagination and filter.
     * Can filter by deliveryAt, consistencyRuleId, and repositoryId.
     * @query query ConsistencyRuleDeliverySearchDTO query to filter by deliveryAt, consistencyRuleId, and repositoryId.
     */
    @Example<PaginationResponseDTO<ConsistencyRuleDeliveryResponseDTO>>({
        totalPages: 1,
        results: [
            {
                id: 1,
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-01-01"),
                status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
            },
        ],
    })
    @Get("/")
    @SuccessResponse("200", "Found consistency rule deliveries")
    public async getAll(
        @Queries() query: ConsistencyRuleDeliverySearchDTO
    ): Promise<PaginationResponseDTO<ConsistencyRuleDeliveryResponseDTO>> {
        this.setStatus(200);
        const serviceResponse =
            await this.consistencyRuleDeliveryService.findAll(query);
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(
                this.consistencyRuleDeliveryMapper.toDto
            ),
        };
    }

    /**
     * Get an existing ConsistencyRuleDelivery by id.
     * @path id Id of the ConsistencyRuleDelivery to get.
     */
    @Example<ConsistencyRuleDeliveryResponseDTO>({
        id: 1,
        consistencyRuleId: 1,
        repositoryId: 1,
        deliveryAt: new Date("2023-01-01"),
        status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
    })
    @Get("/{id}")
    @SuccessResponse("200", "Found consistency rule delivery")
    public async getOne(
        @Path() id: number
    ): Promise<ConsistencyRuleDeliveryResponseDTO> {
        this.setStatus(200);
        const serviceResponse =
            await this.consistencyRuleDeliveryService.findOneBy({
                id: id,
            });
        return this.consistencyRuleDeliveryMapper.toDto(serviceResponse);
    }
}
