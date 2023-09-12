import { Repository } from "../model/Repository";
import logger from "../config/LogConfig";
import { getTotalPages, sequelizePagination } from "../utils/pagination";
import { PaginationResponseDTO } from "@gitgrade/dtos";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

export default class RepositoryService {
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
}
