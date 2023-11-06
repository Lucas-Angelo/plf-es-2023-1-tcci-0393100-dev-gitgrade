import {
    ConsistencyRuleDeliveryCreateDTO,
    ConsistencyRuleDeliveryFindOneDTO,
    ConsistencyRuleDeliverySearchDTO,
    ConsistencyRuleDeliveryUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { Op } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { ConsistencyRuleDeliveryWhereClauseType } from "../interface/ConsistencyRuleDelivery";
import { ConsistencyRule } from "../model/ConsistencyRule";
import {
    ConsistencyRuleDelivery,
    ConsistencyRuleDeliveryStatus,
} from "../model/ConsistencyRuleDelivery";
import { Sprint } from "../model/Sprint";
import { SequelizeUtil } from "../utils/SequelizeUtil";
import { sequelizePagination } from "../utils/pagination";
import ConsistencyRuleService from "./ConsistencyRuleService";
import RepositoryService from "./RepositoryService";

export default class ConsistencyRuleDeliveryService {
    private sequelizeUtil: SequelizeUtil;
    private repositoryService: RepositoryService;
    private consistencyRuleService: ConsistencyRuleService;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
        this.repositoryService = new RepositoryService();
        this.consistencyRuleService = new ConsistencyRuleService();
    }

    /**
     * Create a new ConsistencyRuleDelivery.
     */
    async create(
        data: ConsistencyRuleDeliveryCreateDTO
    ): Promise<ConsistencyRuleDelivery> {
        this.validateNotNullAndEmptyFields(data);

        if (data.status && data.deliveryAt)
            this.checkIfStatusAndDeliveryAtAreValid(
                data.status,
                data.deliveryAt
            );

        await this.consistencyRuleService.findOneBy({
            id: data.consistencyRuleId,
        });

        await this.repositoryService.findOneBy({ id: data.repositoryId });

        logger.info("Checking if consistency rule delivery already exists");

        await this.checkIfAlreadyExistsConsistencyRuleDelivery(
            data.repositoryId,
            data.consistencyRuleId,
            data.status
        );
        try {
            logger.info("Creating a new consistency rule delivery");

            const consistencyRuleDelivery =
                await ConsistencyRuleDelivery.create(data);

            logger.info(
                "Successfully created a new ConsistencyRuleDelivery: ",
                {
                    consistencyRuleDelivery,
                }
            );

            const newConsistencyRuleDelivery =
                await ConsistencyRuleDelivery.findOne({
                    where: { id: consistencyRuleDelivery.id },
                    include: [
                        {
                            model: ConsistencyRule,
                            as: "consistencyRule",
                            include: [
                                {
                                    model: Sprint,
                                    as: "sprint",
                                },
                            ],
                        },
                    ],
                });

            if (!newConsistencyRuleDelivery) {
                logger.error(
                    `ConsistencyRuleDelivery with id: ${consistencyRuleDelivery.id} not found`
                );
                throw new AppError(
                    `ConsistencyRuleDelivery with id: ${consistencyRuleDelivery.id} not found`,
                    404
                );
            }

            return newConsistencyRuleDelivery;
        } catch (error) {
            logger.error("Error creating a new consistency rule delivery:", {
                error,
            });
            throw new AppError(
                "Failed to create a new consistency rule delivery",
                500,
                error
            );
        }
    }

    /**
     * Update an existing ConsistencyRuleDelivery.
     */
    async update(
        id: number,
        data: ConsistencyRuleDeliveryUpdateDTO
    ): Promise<ConsistencyRuleDelivery> {
        if (!id) {
            logger.error("Id not provided", { id });
            throw new AppError("Id not provided", 400);
        }

        this.validateNotNullAndEmptyFields(data);

        if (data.status && data.deliveryAt)
            this.checkIfStatusAndDeliveryAtAreValid(
                data.status,
                data.deliveryAt
            );

        await this.consistencyRuleService.findOneBy({
            id: data.consistencyRuleId,
        });

        await this.repositoryService.findOneBy({ id: data.repositoryId });

        logger.info(`Updating consistency rule delivery with id: ${id}`);
        const consistencyRuleDelivery = await this.findOneBy({ id });
        try {
            logger.info("Current and new consistency rule delivery data: ", {
                current: consistencyRuleDelivery,
                new: data,
            });

            await consistencyRuleDelivery.update(data);

            const newConsistencyRuleDelivery =
                await ConsistencyRuleDelivery.findOne({
                    where: { id },
                    include: [
                        {
                            model: ConsistencyRule,
                            as: "consistencyRule",
                            include: [
                                {
                                    model: Sprint,
                                    as: "sprint",
                                },
                            ],
                        },
                    ],
                });

            if (!newConsistencyRuleDelivery) {
                logger.error(
                    `ConsistencyRuleDelivery with id: ${id} not found`
                );
                throw new AppError(
                    `ConsistencyRuleDelivery with id: ${id} not found`,
                    404
                );
            }

            logger.info("Successfully updated consistency rule delivery: ", {
                newConsistencyRuleDelivery,
            });

            return newConsistencyRuleDelivery;
        } catch (error) {
            logger.error(
                `Error updating consistency rule delivery with id: ${id}`,
                {
                    error,
                }
            );
            throw new AppError(
                `Failed to update consistency rule delivery with id: ${id}`,
                500,
                error
            );
        }
    }

    /**
     * Find all ConsistencyRuleDeliveries based on given filters.
     */
    async findAllBy(
        search: ConsistencyRuleDeliverySearchDTO
    ): Promise<PaginationResponseDTO<ConsistencyRuleDelivery>> {
        try {
            logger.info("Searching for all consistency rule deliveries");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } =
                await ConsistencyRuleDelivery.findAndCountAll({
                    ...sequelizePagination(
                        search.page || 1,
                        search.limit || 10
                    ),
                    where: Object.keys(whereClause).length
                        ? whereClause
                        : undefined,
                    include: [
                        {
                            model: ConsistencyRule,
                            as: "consistencyRule",
                            include: [
                                {
                                    model: Sprint,
                                    as: "sprint",
                                    attributes: ["id", "name", "end_date"],
                                },
                            ],
                        },
                    ],
                    order: [["id", "DESC"]],
                });

            logger.info(
                "Successfully found all consistency rule deliveries: ",
                {
                    count,
                }
            );

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all consistency rule deliveries:", {
                error,
            });
            throw new AppError(
                "Failed to find all consistency rule deliveries",
                500,
                error
            );
        }
    }

    /**
     * Find a single ConsistencyRuleDelivery based on given filters.
     */
    async findOneBy(
        fields: Partial<ConsistencyRuleDeliveryFindOneDTO>
    ): Promise<ConsistencyRuleDelivery> {
        try {
            logger.info(`Searching for consistency rule delivery by fields:`, {
                fields,
            });

            if (fields.consistencyRuleId)
                await this.consistencyRuleService.findOneBy({
                    id: fields.consistencyRuleId,
                });

            if (fields.repositoryId)
                await this.repositoryService.findOneBy({
                    id: fields.repositoryId,
                });

            const consistencyRuleDelivery =
                await ConsistencyRuleDelivery.findOne({
                    where: { ...fields },
                    include: [
                        {
                            model: ConsistencyRule,
                            as: "consistencyRule",
                            include: [
                                {
                                    model: Sprint,
                                    as: "sprint",
                                    attributes: ["id", "name", "end_date"],
                                },
                            ],
                        },
                    ],
                    paranoid: false,
                });

            if (!consistencyRuleDelivery) {
                logger.info(
                    `Consistency rule delivery not found by fields ${JSON.stringify(
                        fields
                    )}`
                );
                throw new AppError(
                    `Consistency rule delivery not found by fields ${JSON.stringify(
                        fields
                    )}`,
                    404
                );
            } else
                logger.info(
                    `Consistency rule delivery found by fields ${JSON.stringify(
                        fields
                    )}:`,
                    { consistencyRuleDelivery }
                );

            return consistencyRuleDelivery;
        } catch (error) {
            logger.error(
                `Error finding consistency rule delivery by fields ${JSON.stringify(
                    fields
                )}:`,
                { error }
            );
            throw error;
        }
    }

    private validateNotNullAndEmptyFields(
        data:
            | ConsistencyRuleDeliveryCreateDTO
            | ConsistencyRuleDeliveryUpdateDTO
    ): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            ConsistencyRuleDelivery,
            data
        );

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new AppError(errorMessage, 400);
        } else logger.info("All required fields are present.");
    }

    private _constructWhereClause(
        filter:
            | ConsistencyRuleDeliveryFindOneDTO
            | ConsistencyRuleDeliverySearchDTO
    ): ConsistencyRuleDeliveryWhereClauseType {
        const whereClause: ConsistencyRuleDeliveryWhereClauseType = {};

        if (filter.deliveryAt) whereClause.deliveryAt = filter.deliveryAt;
        else {
            if (filter.deliveryAtStart)
                whereClause.deliveryAt = {
                    [Op.gte]: filter.deliveryAtStart,
                };

            if (filter.deliveryAtEnd)
                whereClause.deliveryAt = {
                    [Op.lte]: filter.deliveryAtEnd,
                };
        }

        if (filter.evaluationMethodId)
            whereClause["$consistencyRule.evaluation_method_id$"] =
                filter.evaluationMethodId;

        if (filter.sprintId)
            whereClause["$consistencyRule.sprint_id$"] = filter.sprintId;

        if (filter.consistencyRuleId)
            whereClause.consistencyRuleId = filter.consistencyRuleId;

        if (filter.repositoryId) whereClause.repositoryId = filter.repositoryId;

        if (filter.status) whereClause.status = filter.status;

        return whereClause;
    }

    private checkIfStatusAndDeliveryAtAreValid(
        status: string,
        deliveryAt: Date
    ): void {
        if (status === "AWAITING_DELIVERY" && deliveryAt) {
            logger.error(
                "Cannot set deliveryAt when status is AWAITING_DELIVERY",
                400
            );
            throw new AppError(
                "Cannot set deliveryAt when status is AWAITING_DELIVERY",
                400
            );
        }

        if (status === "NOT_DELIVERED" && deliveryAt) {
            logger.error(
                "Cannot set deliveryAt when status is NOT_DELIVERED",
                400
            );
            throw new AppError(
                "Cannot set deliveryAt when status is NOT_DELIVERED",
                400
            );
        }
    }

    private async checkIfAlreadyExistsConsistencyRuleDelivery(
        repositoryId: number,
        consistencyRuleId: number,
        status: ConsistencyRuleDeliveryStatus
    ): Promise<void> {
        const existentConsistencyRuleDelivery = await this.findAllBy({
            repositoryId,
            consistencyRuleId,
            status,
        });

        if (existentConsistencyRuleDelivery.results.length > 0) {
            logger.error(`Consistency rule delivery already exists`, 400);
            throw new AppError(`Consistency rule delivery already exists`, 400);
        }
    }
}
