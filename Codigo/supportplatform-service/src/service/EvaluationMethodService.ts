import {
    EvaluationMethodCreateDTO,
    EvaluationMethodFindOneDTO,
    EvaluationMethodSearchDTO,
    EvaluationMethodUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { Op } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { EvaluationMethodWhereClauseType } from "../interface/EvaluationMethod";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { SequelizeUtil } from "../utils/SequelizeUtil";
import { sequelizePagination } from "../utils/pagination";

export default class EvaluationMethodService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    /**
     * Create a new EvaluationMethod.
     */
    async create(data: EvaluationMethodCreateDTO): Promise<EvaluationMethod> {
        try {
            logger.info("Creating a new evaluation method");

            this.validateNotNullAndEmptyFields(data);

            this.checkIfIsAValidSemester(data.semester);

            const evaluationMethod = await EvaluationMethod.create(data);

            logger.info("Successfully created a new evaluation method: ", {
                evaluationMethod,
            });

            return evaluationMethod;
        } catch (error) {
            logger.error("Error creating a new evaluation method:", { error });
            throw new AppError(
                "Failed to create a new evaluation method",
                500,
                error
            );
        }
    }

    /**
     * Update an existing EvaluationMethod.
     */
    async update(
        id: number,
        data: EvaluationMethodUpdateDTO
    ): Promise<EvaluationMethod> {
        try {
            if (!id) {
                logger.error("Id not provided", { id });
                throw new AppError("Id not provided", 400);
            }

            this.validateNotNullAndEmptyFields(data);

            this.checkIfIsAValidSemester(data.semester);

            logger.info(`Updating evaluation method with id: ${id}`);
            const evaluationMethod = await EvaluationMethod.findOne({
                where: { id },
                paranoid: false,
            });

            if (!evaluationMethod) {
                logger.error(`Evaluation method with id: ${id} not found`);
                throw new AppError(
                    `Evaluation method with id: ${id} not found`,
                    404
                );
            }

            logger.info("Current and new evaluation method data: ", {
                current: evaluationMethod,
                new: data,
            });

            await evaluationMethod.update(data);

            logger.info("Successfully updated evaluation method: ", {
                evaluationMethod,
            });

            return evaluationMethod;
        } catch (error) {
            logger.error(`Error updating evaluation method with id: ${id}`, {
                error,
            });
            throw new AppError(
                `Failed to update evaluation method with id: ${id}`,
                500,
                error
            );
        }
    }

    /**
     * Find all EvaluationMethods based on given filters.
     */
    async findAll(
        search: EvaluationMethodSearchDTO
    ): Promise<PaginationResponseDTO<EvaluationMethod>> {
        try {
            logger.info("Searching for all evaluation methods");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await EvaluationMethod.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: Object.keys(whereClause).length
                    ? whereClause
                    : undefined,
                paranoid: !search.forceDisabled,
            });

            logger.info("Successfully found all evaluation methods: ", {
                count,
            });

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all evaluation methods:", { error });
            throw new AppError(
                "Failed to find all evaluation methods",
                500,
                error
            );
        }
    }

    /**
     * Find a single EvaluationMethod based on given filters.
     */
    async findOneBy(
        fields: Partial<EvaluationMethodFindOneDTO>
    ): Promise<EvaluationMethod> {
        try {
            logger.info(`Searching for evaluation method by fields:`, {
                fields,
            });
            const evaluationMethod = await EvaluationMethod.findOne({
                where: { ...fields },
                paranoid: false,
            });
            if (!evaluationMethod) {
                logger.info(
                    `Evaluation method not found by fields ${JSON.stringify(
                        fields
                    )}`
                );
                throw new AppError("Evaluation method not found", 404);
            } else
                logger.info(
                    `Evaluation method found by fields ${JSON.stringify(
                        fields
                    )}:`,
                    { evaluationMethod }
                );

            return evaluationMethod;
        } catch (error) {
            logger.error(
                `Error finding evaluation method by fields ${JSON.stringify(
                    fields
                )}:`,
                { error }
            );
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            logger.info(`Deleting evaluation method with id: ${id}`);
            const evaluationMethod = await EvaluationMethod.findOne({
                where: { id },
                paranoid: false,
            });

            if (!evaluationMethod) {
                logger.error(`Evaluation method with id: ${id} not found`);
                throw new AppError(
                    `Evaluation method with id: ${id} not found`,
                    404
                );
            }

            logger.info("Current evaluation method data: ", {
                current: evaluationMethod,
            });

            await evaluationMethod.destroy();

            logger.info("Successfully deleted evaluation method: ", {
                evaluationMethod,
            });
        } catch (error) {
            logger.error(`Error deleting evaluation method with id: ${id}`, {
                error,
            });
            throw new AppError(
                `Failed to delete evaluation method with id: ${id}`,
                500,
                error
            );
        }
    }

    private validateNotNullAndEmptyFields(
        data: EvaluationMethodCreateDTO | EvaluationMethodUpdateDTO
    ): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            EvaluationMethod,
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

    /**
     * Construct the WHERE clause for querying.
     */
    private _constructWhereClause(
        filter: EvaluationMethodSearchDTO
    ): EvaluationMethodWhereClauseType {
        const whereClause: EvaluationMethodWhereClauseType = {};

        if (filter.description)
            whereClause.description = {
                [Op.like]: `%${filter.description}%`,
            };
        if (filter.semester) whereClause.semester = filter.semester;
        if (filter.year) whereClause.year = filter.year;

        if (filter.disabledAt) whereClause.disabledAt = filter.disabledAt;

        logger.info("Constructed where clause: ", { whereClause });
        return whereClause;
    }

    private checkIfIsAValidSemester(semester: number): boolean {
        return semester === 1 || semester === 2;
    }
}
