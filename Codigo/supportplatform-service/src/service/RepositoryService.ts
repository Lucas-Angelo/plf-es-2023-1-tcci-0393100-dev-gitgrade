import { Repository } from "../model/Repository";
import logger from "../config/LogConfig";
import { sequelizePagination } from "../utils/pagination";
import { PaginationResponseDTO } from "@gitgrade/dtos";
import { Op } from "sequelize";

export default class RepositoryService {
    async findAll(search: {
        page: number;
        limit: number;
        filter?: string;
    }): Promise<PaginationResponseDTO<Repository>> {
        try {
            logger.info("Searching for all repositories");
            const { rows, count } = await Repository.findAndCountAll({
                ...sequelizePagination(search.page, search.limit),
                where: search.filter
                    ? {
                          name: {
                              [Op.like]: `%${search.filter}%`,
                          },
                      }
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
