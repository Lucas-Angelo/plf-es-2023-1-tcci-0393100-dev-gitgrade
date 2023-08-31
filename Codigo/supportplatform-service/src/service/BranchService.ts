import { PaginationResponseDTO } from "@gitgrade/dtos";
import logger from "../config/LogConfig";
import { Branch } from "../model/Branch";
import { getTotalPages, sequelizePagination } from "../utils/pagination";

export default class BranchService {
    async getByRepositoryId(
        repositoryId: number,
        search: {
            limit: number;
            page: number;
        }
    ): Promise<PaginationResponseDTO<Branch>> {
        try {
            logger.info("Searching for all branches");
            const { rows, count } = await Branch.findAndCountAll({
                attributes: ["name", "id"],
                ...sequelizePagination(search.page, search.limit),
                where: {
                    repositoryId,
                },
            });
            return {
                results: rows,
                totalPages: getTotalPages(count, search.limit),
            };
        } catch (error) {
            logger.error("Error finding all branches:", { error });
            throw error;
        }
    }
}
