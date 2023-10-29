// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dirname from "es-dirname";
import path from "path";
// import { Worker } from "worker_threads";
import { Worker } from "worker_threads";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { CodeQuality, CodeQualityStatus } from "../model/CodeQuality";
import SonarQubeAnalyzer from "../sonarqube/SonarQubeAnalyzer";
import RepositoryService from "./RepositoryService";

const projectRootPath = path.join(dirname(), "../../");

export class CodeQualityService {
    private repositoryService: RepositoryService;
    private isWorkerRunning: boolean;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.isWorkerRunning = false;
    }

    /**
     * Create a new CodeQuality.
     */
    async create(repositoryId: number): Promise<CodeQuality> {
        let codeQuality: CodeQuality;
        try {
            if (this.isWorkerRunning) {
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

            const analysisPath = sonarQubeAnalyzer.buildPath();

            codeQuality = await CodeQuality.create({
                repositoryId,
                path: analysisPath,
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

            this.isWorkerRunning = true;
            const worker = new Worker(sonarQubeWorkerPath);
            const obj = {
                repositoryName: repository.name,
                projectKey,
                projectName,
            };
            worker.postMessage(obj);

            worker.on("message", async (message) => {
                if (message === "done") {
                    this.isWorkerRunning = false;
                    await codeQuality.update({
                        status: CodeQualityStatus.ANALYZED,
                    });
                }
            });

            worker.on("error", async (error) => {
                logger.error("Error in worker thread:", { error });
                if (codeQuality) {
                    this.isWorkerRunning = false;
                    await codeQuality.update({
                        status: CodeQualityStatus.ERROR,
                    });
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

    async findAllByRepositoryId(repositoryId: number): Promise<CodeQuality[]> {
        try {
            logger.info("Finding all code quality analysis by repository id");
            const codeQualities = await CodeQuality.findAll({
                where: {
                    repositoryId,
                },
            });
            return codeQualities;
        } catch (error) {
            logger.error("Error finding all code quality analysis:", { error });
            throw new AppError(
                "Failed to find all code quality analysis",
                500,
                error
            );
        }
    }
}

export default new CodeQualityService();
