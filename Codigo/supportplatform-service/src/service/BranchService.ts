import { PaginationResponseDTO } from "@gitgrade/dtos";
import logger from "../config/LogConfig";
import { Branch } from "../model/Branch";
import { getTotalPages, sequelizePagination } from "../utils/pagination";
import RepositoryService from "./RepositoryService";
import AppError from "../error/AppError";

export default class BranchService {
    private repositoryService: RepositoryService;
    constructor() {
        this.repositoryService = new RepositoryService();
    }

    async getByRepositoryId(
        repositoryId: number,
        search: {
            limit: number;
            page: number;
        }
    ): Promise<PaginationResponseDTO<Branch>> {
        try {
            const repository =
                await this.repositoryService.findById(repositoryId);

            if (!repository) {
                throw new AppError("Repository not found", 404);
            }

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
