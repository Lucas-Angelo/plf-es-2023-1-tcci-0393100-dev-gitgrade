import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryPatchDTO,
} from "@gitgrade/dtos";
import { Op, Sequelize } from "sequelize";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { Repository } from "../model/Repository";
import { sequelizePagination } from "../utils/pagination";
import EvaluationMethodService from "./EvaluationMethodService";
import { RepositoryWhereClauseType } from "../interface/Repository";

export default class RepositoryService {
    private evaluationMethodService: EvaluationMethodService;

    constructor() {
        this.evaluationMethodService = new EvaluationMethodService();
    }

    async findAll(search: {
        page: number;
        limit: number;
        filter?: string;
        evaluationMethodId?: number | null;
    }): Promise<PaginationResponseDTO<Repository>> {
        try {
            logger.info("Searching for all repositories");
            const whereClause = this._constructWhereClause(search);

            const { rows, count } = await Repository.findAndCountAll({
                ...sequelizePagination(search.page, search.limit),
                where: whereClause,
                include: [
                    {
                        model: EvaluationMethod,
                        as: "evaluationMethod",
                    },
                ],
            });
            return {
                results: rows,
                totalPages: Math.ceil(count / search.limit) || 1,
            };
        } catch (error) {
            logger.error("Error finding all repositories:", { error });
            throw error;
        }
    }

    async patch(id: number, body: RepositoryPatchDTO): Promise<Repository> {
        try {
            logger.info(`Updating repository ${id}`);
            if (body.evaluationMethodId)
                await this.evaluationMethodService.findOneBy({
                    id: body.evaluationMethodId,
                });
            const repository = await Repository.findOne({
                where: { id },
            });
            if (!repository) {
                logger.error(`Error updating repository ${id}:`);
                throw new AppError("Repository not found", 404);
            }
            await repository.update(body);
            const newRepository = await Repository.findOne({
                where: { id },
                include: [
                    {
                        model: EvaluationMethod,
                        as: "evaluationMethod",
                    },
                ],
            });
            if (!newRepository) {
                logger.error(`Error updating repository ${id}:`);
                throw new AppError("Repository not found", 404);
            }
            logger.info(`Successfully updated repository ${id}`);
            return newRepository;
        } catch (error) {
            logger.error(`Error updating repository ${id}:`, { error });
            throw error;
        }
    }

    /**
     * Construct the WHERE clause for querying.
     */
    private _constructWhereClause(
        filter: GetAllRepositoryQueryDTO
    ): RepositoryWhereClauseType {
        const whereConditions: RepositoryWhereClauseType[typeof Op.and] = [];

        if (filter.filter) {
            const loweredFilter = filter.filter.toLowerCase();
            whereConditions.push(
                Sequelize.where(
                    Sequelize.fn("lower", Sequelize.col("name")),
                    Op.like,
                    `%${loweredFilter}%`
                )
            );
        }
        if (filter.evaluationMethodId !== undefined) {
            whereConditions.push({
                evaluationMethodId: filter.evaluationMethodId,
            });
        }

        const whereClause =
            whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};
        logger.info("Constructed where clause: ", { whereClause });

        return whereClause;
    }
}
