import { CodeQualitySearchDTO, PaginationResponseDTO } from "@gitgrade/dtos";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dirname from "es-dirname";
import path from "path";
import { Op } from "sequelize";
import { Worker } from "worker_threads";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { CodeQualityWhereClauseType } from "../interface/CodeQuality";
import { CodeQuality, CodeQualityStatus } from "../model/CodeQuality";
import SonarQubeAnalyzer from "../sonarqube/SonarQubeAnalyzer";
import { sequelizePagination } from "../utils/pagination";
import RepositoryService from "./RepositoryService";

const projectRootPath = path.join(dirname(), "../../");

export class CodeQualityService {
    private static timeoutTimeInMinutes = 30;
    private static isWorkerRunning: boolean;

    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
        CodeQualityService.isWorkerRunning = false;
    }

    /**
     * Create a new CodeQuality.
     */
    async create(repositoryId: number): Promise<CodeQuality> {
        let codeQuality: CodeQuality;
        try {
            if (CodeQualityService.isWorkerRunning) {
                logger.error(
                    "Another code quality analysis is already running"
                );
                throw new AppError(
                    "Another code quality analysis is already running",
                    429
                );
            }

            logger.info("Creating a new code quality");
            const repository = await this.repositoryService.findOneBy({
                id: repositoryId,
            });

            if (!repository) {
                logger.error("Repository not found");
                throw new AppError("Repository not found", 404);
            }

            const sonarQubeAnalyzer: SonarQubeAnalyzer = new SonarQubeAnalyzer(
                repository.name
            );
            const projectKey = sonarQubeAnalyzer.getProjectKey();
            const projectName = sonarQubeAnalyzer.getProjectName();
            const analysisUrl = sonarQubeAnalyzer.buildUrl();

            codeQuality = await CodeQuality.create({
                repositoryId,
                url: analysisUrl,
                status: CodeQualityStatus.ANALYZING,
            });

            if (!codeQuality) {
                logger.error("Failed to create a new code quality");
                throw new AppError("Failed to create a new code quality", 500);
            }

            logger.info("Starting code quality analysis");
            const sonarQubeWorkerPath = path.join(
                projectRootPath,
                projectRootPath.startsWith("/usr/src")
                    ? "src/worker/SonarQubeWorker.js"
                    : "src/worker/SonarQubeWorker.ts"
            );
            logger.info("SonarQubeWorker path", { sonarQubeWorkerPath });

            CodeQualityService.isWorkerRunning = true;
            const worker = new Worker(sonarQubeWorkerPath);
            const obj = {
                repositoryName: repository.name,
                projectKey,
                projectName,
            };
            worker.postMessage(obj);

            // Set the timeout for the worker to ensure that it will not run forever
            const timeout = setTimeout(
                async () => {
                    logger.error(
                        "SonarQube analysis timed out. Terminating worker."
                    );
                    worker.terminate();
                    CodeQualityService.isWorkerRunning = false;
                    await codeQuality.update({
                        status: CodeQualityStatus.ERROR,
                    });
                },
                CodeQualityService.timeoutTimeInMinutes * 60 * 1000
            );

            worker.on("message", async (message) => {
                if (message === "done") {
                    clearTimeout(timeout);
                    CodeQualityService.isWorkerRunning = false;
                    await codeQuality.update({
                        status: CodeQualityStatus.ANALYZED,
                    });
                }
            });

            worker.on("error", async (error) => {
                clearTimeout(timeout);
                logger.error("Error in worker thread:", { error });
                if (codeQuality) {
                    CodeQualityService.isWorkerRunning = false;
                    await codeQuality.update({
                        status: CodeQualityStatus.ERROR,
                    });
                }
            });

            worker.on("exit", async (code) => {
                if (code !== 0) {
                    logger.error(`Worker stopped with exit code ${code}`);
                }
            });

            logger.info("Code quality analysis finished");
            return codeQuality;
        } catch (error) {
            logger.error("Error creating a new code quality:", { error });
            throw new AppError(
                "Failed to create a new code quality",
                500,
                error
            );
        }
    }

    async findAllByRepositoryId(
        repositoryId: number,
        query: CodeQualitySearchDTO
    ): Promise<PaginationResponseDTO<CodeQuality>> {
        try {
            logger.info(
                "Searching for all code quality analysis by repositoryId"
            );

            const whereClause = this._constructWhereClause(repositoryId, query);

            const { rows, count } = await CodeQuality.findAndCountAll({
                ...sequelizePagination(query.page || 1, query.limit || 10),
                where: Object.keys(whereClause).length
                    ? whereClause
                    : undefined,
                order: [["createdAt", "DESC"]],
            });

            logger.info(
                "Successfully found all code quality analysis by repositoryId: ",
                { count }
            );

            return {
                results: rows,
                totalPages: Math.ceil(count / (query.limit || 10)) || 1,
            };
        } catch (error) {
            logger.error(
                "Error finding all code quality analysis by repositoryId:",
                { error }
            );
            throw new AppError(
                "Failed to find all code quality analysis by repositoryId",
                500,
                error
            );
        }
    }

    private _constructWhereClause(
        repositoryId: number,
        filter: CodeQualitySearchDTO
    ): CodeQualityWhereClauseType {
        const whereClause: CodeQualityWhereClauseType = {
            repositoryId,
        };

        if (filter.url)
            whereClause.url = {
                [Op.like]: `%${filter.url}%`,
            };
        if (filter.status) whereClause.status = filter.status;
        if (filter.createdAt) whereClause.createdAt = filter.createdAt;

        logger.info("Constructed where clause: ", { whereClause });
        return whereClause;
    }
}

export default new CodeQualityService();
