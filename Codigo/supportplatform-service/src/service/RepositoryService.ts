import { Repository } from "@gitgrade/models";
import logger from "../config/LogConfig";
import { sequelizePagination } from "../utils/pagination";
import { PaginationResponse } from "../types/pagination";

export default class RepositoryService {
    async findAll(search: {page: number; limit: number; filter?: string}): Promise<PaginationResponse<Repository>> {
        try {
            logger.info("Searching for all repositories");
            const { rows, count } = await Repository.findAndCountAll({
                ...sequelizePagination(search.page, search.limit), 
            }, );
            return {
                data: rows,
                totalPages: Math.ceil(count / search.limit) || 1,
            };
        } catch (error) {
            logger.error("Error finding all repositories:", { error });
            throw error;
        }
    }
}