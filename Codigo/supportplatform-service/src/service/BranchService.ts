import { PaginationResponseDTO } from "@gitgrade/dtos";
import logger from "../config/LogConfig";
import { Branch } from "../model/Branch";
import { getTotalPages, sequelizePagination } from "../utils/pagination";
import RepositoryService from "./RepositoryService";
import AppError from "../error/AppError";
import { BranchPatchDTO } from "@gitgrade/dtos/dto/branch";
import { Repository } from "../model/Repository";

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
                attributes: [
                    "name",
                    "id",
                    "fileAutomaticSynchronization",
                    "commitAutomaticSynchronization",
                    "repositoryId",
                ],
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

    async patch(
        repositoryId: number,
        id: number,
        body: BranchPatchDTO
    ): Promise<Branch> {
        try {
            logger.info(`Updating branch ${id}`);
            const repository = await Repository.findOne({
                where: { id: repositoryId },
            });

            if (!repository) {
                logger.error(`Error updating branch ${id}:`);
                throw new AppError("Repository not found", 404);
            }
            const branch = await Branch.findOne({
                where: { id },
            });
            if (!branch) {
                logger.error(`Error updating branch ${id}:`);
                throw new AppError("Branch not found", 404);
            } else if (branch.repositoryId != repositoryId) {
                logger.error(`Error updating branch ${id}:`);
                throw new AppError("Branch not found", 404);
            }

            console.log("ola manitos", id, body);
            await Branch.update(body, {
                where: { id },
            });

            const newBranch = await Branch.findOne({
                where: { id },
            });
            if (!newBranch) {
                logger.error(`Error updating branch ${id}:`);
                throw new AppError("Branch not found", 404);
            }
            logger.info(`Successfully updated repository ${id}`);
            return newBranch;
        } catch (error) {
            logger.error(`Error updating repository ${id}:`, { error });
            throw error;
        }
    }
}
