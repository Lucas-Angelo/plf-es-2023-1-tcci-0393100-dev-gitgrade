import {
    PaginationResponseDTO,
    SprintCreateDTO,
    SprintFindOneDTO,
    SprintSearchDTO,
    SprintUpdateDTO,
} from "@gitgrade/dtos";
import { Op, Sequelize } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { SprintWhereClauseType } from "../interface/Sprint";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { Sprint } from "../model/Sprint";
import { SequelizeUtil } from "../utils/SequelizeUtil";
import { sequelizePagination } from "../utils/pagination";

export default class SprintService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    /**
     * Create a new Sprint.
     */
    async create(data: SprintCreateDTO): Promise<Sprint> {
        try {
            logger.info("Creating a new sprint");

            this.validateNotNullAndEmptyFields(data);

            await this.checkIfEvaluationMethodExists(data.evaluationMethodId);

            this.checkIfStartDateIsBeforeEndDate(
                data.start_date,
                data.end_date
            );

            const sprint = await Sprint.create(data);

            logger.info("Successfully created a new Sprint: ", {
                sprint,
            });

            return sprint;
        } catch (error) {
            logger.error("Error creating a new sprint:", { error });
            throw new AppError("Failed to create a new sprint", 500, error);
        }
    }

    /**
     * Update an existing Sprint.
     */
    async update(id: number, data: SprintUpdateDTO): Promise<Sprint> {
        try {
            if (!id) {
                logger.error("Id not provided", { id });
                throw new AppError("Id not provided", 400);
            }

            this.validateNotNullAndEmptyFields(data);

            await this.checkIfEvaluationMethodExists(data.evaluationMethodId);

            this.checkIfStartDateIsBeforeEndDate(
                data.start_date,
                data.end_date
            );

            logger.info(`Updating sprint with id: ${id}`);
            const sprint = await this.findOneBy({ id });

            logger.info("Current and new sprint data: ", {
                current: sprint,
                new: data,
            });

            await sprint.update(data);

            const newSprint = await Sprint.findOne({
                where: { id },
            });

            if (!newSprint) {
                logger.error(`Sprint with id: ${id} not found`);
                throw new AppError(`Sprint with id: ${id} not found`, 404);
            }

            logger.info("Successfully updated sprint: ", {
                newSprint,
            });

            return newSprint;
        } catch (error) {
            logger.error(`Error updating sprint with id: ${id}`, {
                error,
            });
            throw new AppError(
                `Failed to update sprint with id: ${id}`,
                500,
                error
            );
        }
    }

    /**
     * Find all Sprints based on given filters.
     */
    async findAll(
        search: SprintSearchDTO
    ): Promise<PaginationResponseDTO<Sprint>> {
        try {
            logger.info("Searching for all sprints");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await Sprint.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: whereClause,
            });

            logger.info("Successfully found all sprints: ", {
                count,
            });

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all sprints:", { error });
            throw new AppError("Failed to find all sprints", 500, error);
        }
    }

    /**
     * Find a single Sprint based on given filters.
     */
    async findOneBy(fields: Partial<SprintFindOneDTO>): Promise<Sprint> {
        try {
            logger.info(`Searching for sprint by fields:`, {
                fields,
            });
            const sprint = await Sprint.findOne({
                where: { ...fields },
                paranoid: false,
            });
            if (!sprint) {
                logger.info(
                    `Sprint not found by fields ${JSON.stringify(fields)}`
                );
                throw new AppError(
                    `Sprint not found by fields ${JSON.stringify(fields)}`,
                    404
                );
            } else
                logger.info(
                    `Sprint found by fields ${JSON.stringify(fields)}:`,
                    { sprint }
                );

            return sprint;
        } catch (error) {
            logger.error(
                `Error finding sprint by fields ${JSON.stringify(fields)}:`,
                { error }
            );
            throw error;
        }
    }

    private validateNotNullAndEmptyFields(
        data: SprintCreateDTO | SprintUpdateDTO
    ): void {
        const missingFields = this.sequelizeUtil.getMissingFields(Sprint, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new AppError(errorMessage, 400);
        } else logger.info("All required fields are present.");
    }

    private _constructWhereClause(
        filter: SprintFindOneDTO | SprintSearchDTO
    ): SprintWhereClauseType {
        const whereConditions: SprintWhereClauseType[typeof Op.and] = [];

        if (filter.start_date) {
            whereConditions.push({
                start_date: {
                    [Op.gte]: filter.start_date,
                },
            });
        }

        if (filter.end_date) {
            whereConditions.push({
                end_date: {
                    [Op.lte]: filter.end_date,
                },
            });
        }

        if (filter.evaluationMethodId) {
            whereConditions.push({
                evaluationMethodId: filter.evaluationMethodId,
            });
        }

        if (filter.name) {
            whereConditions.push(
                Sequelize.where(
                    Sequelize.fn("lower", Sequelize.col("name")),
                    Op.like,
                    `%${filter.name.toLowerCase()}%`
                )
            );
        }
        logger.info("Constructed where conditions: ", { whereConditions });

        const whereClause = {
            [Op.and]: whereConditions,
        };
        return whereClause;
    }

    private async checkIfEvaluationMethodExists(
        evaluationMethodId: number
    ): Promise<void> {
        await EvaluationMethod.findByPk(evaluationMethodId).then(
            (evaluationMethod) => {
                if (!evaluationMethod) {
                    logger.error(
                        `evaluationMethodId: ${evaluationMethodId} not found`
                    );
                    throw new AppError(
                        `evaluationMethodId: ${evaluationMethodId} not found`,
                        404
                    );
                }
            }
        );
    }

    private checkIfStartDateIsBeforeEndDate(
        start_date: Date,
        end_date: Date
    ): void {
        if (start_date >= end_date) {
            logger.error("start_date must be before end_date");
            throw new AppError("start_date must be before end_date", 400);
        }
    }
}
