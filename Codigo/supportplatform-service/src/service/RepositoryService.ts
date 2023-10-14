import { PaginationResponseDTO, RepositoryPatchDTO } from "@gitgrade/dtos";
import { Op, Sequelize } from "sequelize";
import logger from "../config/LogConfig";
import { getTotalPages, sequelizePagination } from "../utils/pagination";
import AppError from "../error/AppError";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { Repository } from "../model/Repository";
import EvaluationMethodService from "./EvaluationMethodService";

export default class RepositoryService {
    private evaluationMethodService: EvaluationMethodService;

    constructor() {
        this.evaluationMethodService = new EvaluationMethodService();
    }

    async findAll(search: {
        page: number;
        limit: number;
        filter?: string;
    }): Promise<PaginationResponseDTO<Repository>> {
        try {
            logger.info("Searching for all repositories");
            const loweredFilter = search.filter?.toLowerCase();
            const { rows, count } = await Repository.findAndCountAll({
                ...sequelizePagination(search.page, search.limit),
                where: loweredFilter
                    ? [
                          Sequelize.where(
                              Sequelize.fn("lower", Sequelize.col("name")),
                              Op.like,
                              `%${loweredFilter}%`
                          ),
                      ]
                    : undefined,
                include: [
                    {
                        model: EvaluationMethod,
                        as: "evaluationMethod",
                    },
                ],
            });
            return {
                results: rows,
                totalPages: getTotalPages(count, search.limit),
            };
        } catch (error) {
            logger.error("Error finding all repositories:", { error });
            throw error;
        }
    }

    async findById(id: number): Promise<Repository | null> {
        try {
            logger.info("Searching for repository by id:", { id });
            const repository = await Repository.findByPk(id);

            return repository;
        } catch (error) {
            logger.error("Error finding repository by id:", { error });
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
}
