import { PaginationResponseDTO } from "@gitgrade/dtos";
import { Op, Sequelize } from "sequelize";
import logger from "../config/LogConfig";
import { Repository } from "../model/Repository";
import { sequelizePagination } from "../utils/pagination";

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
                totalPages: Math.ceil(count / search.limit) || 1,
            };
        } catch (error) {
            logger.error("Error finding all repositories:", { error });
            throw error;
        }
    }
}
