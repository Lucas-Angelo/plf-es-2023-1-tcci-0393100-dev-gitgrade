import {
    ConsistencyRuleCreateDTO,
    ConsistencyRuleFindOneDTO,
    ConsistencyRuleSearchDTO,
    ConsistencyRuleUpdateDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { Op } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { ConsistencyRuleWhereClauseType } from "../interface/ConsistencyRule";
import { ConsistencyRule } from "../model/ConsistencyRule"; // Ensure you have this model.
import { SequelizeUtil } from "../utils/SequelizeUtil";
import { sequelizePagination } from "../utils/pagination";
import EvaluationMethodService from "./EvaluationMethodService";
import SprintService from "./SprintService";
import StandardizedIssueService from "./StandardizedIssueService";

export default class ConsistencyRuleService {
    private sequelizeUtil: SequelizeUtil;
    private evaluationMethodService: EvaluationMethodService;
    private sprintService: SprintService;
    private standardizedIssueService: StandardizedIssueService;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
        this.evaluationMethodService = new EvaluationMethodService();
        this.sprintService = new SprintService();
        this.standardizedIssueService = new StandardizedIssueService();
    }

    async create(data: ConsistencyRuleCreateDTO): Promise<ConsistencyRule> {
        try {
            logger.info("Creating a new consistency rule");

            this.validateNotNullAndEmptyFields(data);

            await this.evaluationMethodService.findOneBy({
                id: data.evaluationMethodId,
            });

            await this.sprintService.findOneBy({
                id: data.sprintId,
            });

            try {
                await this.sprintService.findOneBy({
                    id: data.sprintId,
                    evaluationMethodId: data.evaluationMethodId,
                });
            } catch (error) {
                logger.error(
                    "Sprint not found for the provided evaluation method",
                    { error }
                );
                throw new AppError(
                    "Sprint not found for the provided evaluation method",
                    404
                );
            }

            if (data.standardizedIssueId)
                await this.standardizedIssueService.findOneBy({
                    id: data.standardizedIssueId,
                });

            const consistencyRule = await ConsistencyRule.create(data);

            logger.info("Successfully created a new consistency rule: ", {
                rule: consistencyRule,
            });

            return consistencyRule;
        } catch (error) {
            logger.error("Error creating a new consistency rule:", { error });
            throw new AppError(
                "Failed to create a new consistency rule",
                500,
                error
            );
        }
    }

    async update(
        id: number,
        data: ConsistencyRuleUpdateDTO
    ): Promise<ConsistencyRule> {
        try {
            if (!id) {
                logger.error("Id not provided", { id });
                throw new AppError("Id not provided", 400);
            }

            this.validateNotNullAndEmptyFields(data);

            await this.evaluationMethodService.findOneBy({
                id: data.evaluationMethodId,
            });

            await this.sprintService.findOneBy({
                id: data.sprintId,
            });

            try {
                await this.sprintService.findOneBy({
                    id: data.sprintId,
                    evaluationMethodId: data.evaluationMethodId,
                });
            } catch (error) {
                logger.error(
                    "Sprint not found for the provided evaluation method",
                    { error }
                );
                throw new AppError(
                    "Sprint not found for the provided evaluation method",
                    404
                );
            }

            if (data.standardizedIssueId)
                await this.standardizedIssueService.findOneBy({
                    id: data.standardizedIssueId,
                });

            logger.info(`Updating consistency rule with id: ${id}`);
            const consistencyRule = await this.findOneBy({ id });

            logger.info("Current and new consistency rule data: ", {
                current: consistencyRule,
                new: data,
            });

            await consistencyRule.update(data);

            const newRule = await ConsistencyRule.findOne({
                where: { id },
                paranoid: false,
            });

            if (!newRule) {
                logger.error(`Consistency rule with id: ${id} not found`);
                throw new AppError(
                    `Consistency rule with id: ${id} not found`,
                    404
                );
            }

            logger.info("Successfully updated consistency rule: ", {
                newRule,
            });

            return newRule;
        } catch (error) {
            logger.error(`Error updating consistency rule with id: ${id}`, {
                error,
            });
            throw new AppError(
                `Failed to update consistency rule with id: ${id}`,
                500,
                error
            );
        }
    }

    async findAll(
        search: ConsistencyRuleSearchDTO
    ): Promise<PaginationResponseDTO<ConsistencyRule>> {
        try {
            logger.info("Searching for all consistency rules");

            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await ConsistencyRule.findAndCountAll({
                ...sequelizePagination(search.page || 1, search.limit || 10),
                where: Object.keys(whereClause).length
                    ? whereClause
                    : undefined,
            });

            logger.info("Successfully found all consistency rules: ", {
                count,
            });

            return {
                results: rows,
                totalPages: Math.ceil(count / (search.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error("Error finding all consistency rules:", { error });
            throw new AppError(
                "Failed to find all consistency rules",
                500,
                error
            );
        }
    }

    async findOneBy(
        fields: Partial<ConsistencyRuleFindOneDTO>
    ): Promise<ConsistencyRule> {
        try {
            logger.info(`Searching for consistency rule by fields:`, {
                fields,
            });

            if (fields.evaluationMethodId)
                await this.evaluationMethodService.findOneBy({
                    id: fields.evaluationMethodId,
                });
            if (fields.sprintId)
                await this.sprintService.findOneBy({ id: fields.sprintId });

            const consistencyRule = await ConsistencyRule.findOne({
                where: { ...fields },
                paranoid: false,
            });

            if (!consistencyRule) {
                logger.error(
                    `Consistency rule not found by fields ${JSON.stringify(
                        fields
                    )}`
                );
                throw new AppError(
                    `Consistency rule not found by fields ${JSON.stringify(
                        fields
                    )}`,
                    404
                );
            } else
                logger.info(
                    `Consistency rule found by fields ${JSON.stringify(
                        fields
                    )}`,
                    { rule: consistencyRule }
                );

            return consistencyRule;
        } catch (error) {
            logger.error(
                `Error finding consistency rule by fields ${JSON.stringify(
                    fields
                )}`,
                { error }
            );
            throw error;
        }
    }

    private validateNotNullAndEmptyFields(
        data: ConsistencyRuleCreateDTO | ConsistencyRuleUpdateDTO
    ): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            ConsistencyRule,
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
        filter: ConsistencyRuleSearchDTO
    ): ConsistencyRuleWhereClauseType {
        const whereClause: ConsistencyRuleWhereClauseType = {};

        if (filter.evaluationMethodId)
            whereClause.evaluationMethodId = filter.evaluationMethodId;

        if (filter.sprintId) whereClause.sprintId = filter.sprintId;

        if (filter.standardizedIssueId)
            whereClause.standardizedIssueId = filter.standardizedIssueId;

        if (filter.description)
            whereClause.description = {
                [Op.like]: `%${filter.description}%`,
            };

        if (filter.filePath)
            whereClause.filePath = {
                [Op.like]: `%${filter.filePath}%`,
            };

        if (filter.validationType)
            whereClause.validationType = filter.validationType;

        return whereClause;
    }
}
