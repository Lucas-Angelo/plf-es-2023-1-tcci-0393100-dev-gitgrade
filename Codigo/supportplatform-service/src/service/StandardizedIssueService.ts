import {
    PaginationResponseDTO,
    StandardizedIssueCreateDTO,
    StandardizedIssueFindOneDTO,
    StandardizedIssueSearchDTO,
    StandardizedIssueUpdateDTO,
} from "@gitgrade/dtos"; // Ajuste os importes de acordo
import { Op } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { StandardizedIssueWhereClauseType } from "../interface/StandardizedIssue"; // Ajuste de acordo
import { ConsistencyRule } from "../model/ConsistencyRule";
import { StandardizedIssue } from "../model/StandardizedIssue"; // Asegure-se de ter este modelo
import { SequelizeUtil } from "../utils/SequelizeUtil";
import { sequelizePagination } from "../utils/pagination";
import EvaluationMethodService from "./EvaluationMethodService";

export default class StandardizedIssueService {
    private sequelizeUtil: SequelizeUtil;
    private evaluationMethodService: EvaluationMethodService;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
        this.evaluationMethodService = new EvaluationMethodService();
    }

    async create(data: StandardizedIssueCreateDTO): Promise<StandardizedIssue> {
        try {
            logger.info("Creating a new standardized issue");

            this.validateNotNullAndEmptyFields(data);

            await this.evaluationMethodService.findOneBy({
                id: data.evaluationMethodId,
            });

            const standardizedIssue = await StandardizedIssue.create(data);

            logger.info("Successfully created a new standardized issue: ", {
                standardizedIssue: standardizedIssue,
            });

            return standardizedIssue;
        } catch (error) {
            logger.error("Error creating a new standardized issue:", { error });
            throw new AppError(
                "Failed to create a new standardized issue",
                500,
                error
            );
        }
    }

    async update(
        id: number,
        data: StandardizedIssueUpdateDTO
    ): Promise<StandardizedIssue> {
        try {
            if (!id) {
                logger.error("Id not provided", { id });
                throw new AppError("Id not provided", 400);
            }

            this.validateNotNullAndEmptyFields(data);

            await this.evaluationMethodService.findOneBy({
                id: data.evaluationMethodId,
            });

            logger.info(`Updating standardized issue with id: ${id}`);
            const standardizedIssue = await this.findOneBy({ id });

            logger.info("Current and new standardized issue data: ", {
                current: standardizedIssue,
                new: data,
            });

            await standardizedIssue.update(data);

            const newIssue = await StandardizedIssue.findOne({
                where: { id },
                paranoid: false,
            });

            if (!newIssue) {
                logger.error(`Standardized issue with id: ${id} not found`);
                throw new AppError(
                    `Standardized issue with id: ${id} not found`,
                    404
                );
            }

            logger.info("Successfully updated standardized issue: ", {
                newIssue,
            });

            return newIssue;
        } catch (error) {
            logger.error(`Error updating standardized issue with id: ${id}`, {
                error,
            });
            throw new AppError(
                `Failed to update standardized issue with id: ${id}`,
                500,
                error
            );
        }
    }

    async findAll(
        search: StandardizedIssueSearchDTO
    ): Promise<PaginationResponseDTO<StandardizedIssue>> {
        try {
            logger.info("Searching for all standardized issues");

            const whereClause = this._constructWhereClause(search);

            if (search.evaluationMethodId)
                await this.evaluationMethodService.findOneBy({
                    id: search.evaluationMethodId,
                });

            const { rows, count } = await StandardizedIssue.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: Object.keys(whereClause).length
                    ? whereClause
                    : undefined,
            });

            logger.info("Successfully found all standardized issues: ", {
                count,
            });

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all standardized issues:", { error });
            throw new AppError(
                "Failed to find all standardized issues",
                500,
                error
            );
        }
    }

    async findOneBy(
        fields: Partial<StandardizedIssueFindOneDTO>
    ): Promise<StandardizedIssue> {
        try {
            logger.info(`Searching for standardized issue by fields:`, {
                fields,
            });

            if (fields.evaluationMethodId)
                await this.evaluationMethodService.findOneBy({
                    id: fields.evaluationMethodId,
                });

            const issue = await StandardizedIssue.findOne({
                where: { ...fields },
                paranoid: false,
            });

            if (!issue) {
                logger.error(
                    `Standardized issue not found by fields ${JSON.stringify(
                        fields
                    )}`
                );
                throw new AppError(
                    `Standardized issue not found by fields ${JSON.stringify(
                        fields
                    )}`,
                    404
                );
            } else
                logger.info(
                    `Standardized issue found by fields ${JSON.stringify(
                        fields
                    )}`,
                    { issue }
                );

            return issue;
        } catch (error) {
            logger.error(
                `Error finding standardized issue by fields ${JSON.stringify(
                    fields
                )}`,
                { error }
            );
            throw error;
        }
    }

    /**
     * Delete a StandardizedIssue.
     * Checks for associated ConsistencyRules before deleting.
     */
    async delete(id: number): Promise<void> {
        const standardizedIssue = await this.findOneBy({ id });

        // Check if there are any associated ConsistencyRules before deleting the StandardizedIssue
        const consistencyRules = await ConsistencyRule.count({
            where: { standardizedIssueId: id },
        });
        if (consistencyRules > 0) {
            throw new AppError(
                "StandardizedIssue cannot be deleted because it has associated evaluations",
                400
            );
        }

        try {
            await standardizedIssue.destroy();
            logger.info("StandardizedIssue successfully deleted");
        } catch (error) {
            logger.error("Error deleting standardizedIssue:", { error });
            throw new AppError(
                "Failed to delete standardizedIssue",
                500,
                error
            );
        }
    }

    private validateNotNullAndEmptyFields(
        data: StandardizedIssueCreateDTO | StandardizedIssueUpdateDTO
    ): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            StandardizedIssue,
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
        filter: StandardizedIssueSearchDTO
    ): StandardizedIssueWhereClauseType {
        const whereClause: StandardizedIssueWhereClauseType = {};

        if (filter.evaluationMethodId)
            whereClause.evaluationMethodId = filter.evaluationMethodId;

        if (filter.title)
            whereClause.title = { [Op.like]: `%${filter.title}%` };

        if (filter.description)
            whereClause.description = { [Op.like]: `%${filter.description}%` };

        return whereClause;
    }
}
