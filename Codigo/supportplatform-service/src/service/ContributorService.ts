import { PaginationResponseDTO } from "@gitgrade/dtos";
import { Contributor } from "../model/Contributor";
import { getTotalPages, sequelizePagination } from "../utils/pagination";
import logger from "../config/LogConfig";
import { Repository } from "../model/Repository";
import AppError from "../error/AppError";
import RepositoryService from "./RepositoryService";

export default class ContributorService {
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
    ): Promise<PaginationResponseDTO<Contributor>> {
        try {
            const repository =
                await this.repositoryService.findById(repositoryId);

            if (!repository) {
                throw new AppError("Repository not found", 404);
            }

            logger.info(
                `Searching for contributors of repository with id ${repositoryId}`
            );
            const { rows, count } = await Contributor.findAndCountAll({
                ...sequelizePagination(search.page, search.limit),
                include: {
                    model: Repository,
                    attributes: [],
                    as: "repositories",
                    where: {
                        id: repositoryId,
                    },
                },
            });
            return {
                results: rows,
                totalPages: getTotalPages(count, search.limit),
            };
        } catch (error) {
            logger.error(
                `Error finding contributor of repository with id ${repositoryId}:`,
                { error }
            );
            throw error;
        }
    }
}
