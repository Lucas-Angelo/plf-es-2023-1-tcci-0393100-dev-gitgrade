import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { CodeQuality, CodeQualityStatus } from "../model/CodeQuality";
import SonarQubeAnalyzer from "../sonarqube/SonarQubeAnalyzer";
import RepositoryService from "./RepositoryService";

export default class CodeQualityService {
    private repositoryService: RepositoryService;

    constructor() {
        this.repositoryService = new RepositoryService();
    }

    /**
     * Create a new CodeQuality.
     */
    async create(repositoryId: number): Promise<CodeQuality> {
        let codeQuality: CodeQuality | undefined = undefined;
        try {
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

            const analysisPath = sonarQubeAnalyzer.buildPath();

            codeQuality = await CodeQuality.create({
                repositoryId,
                path: analysisPath,
                status: CodeQualityStatus.ANALYZING,
            });

            logger.info("Starting code quality analysis");
            await sonarQubeAnalyzer.run();
            logger.info("Code quality analysis finished");

            await codeQuality.update({
                status: CodeQualityStatus.ANALYZED,
            });

            return codeQuality;
        } catch (error) {
            logger.error("Error creating a new code quality:", { error });
            if (codeQuality) {
                await codeQuality.update({
                    status: CodeQualityStatus.ERROR,
                });
            }
            throw new AppError(
                "Failed to create a new code quality",
                500,
                error
            );
        }
    }

    // /**
    //  * Find all CodeQualitys based on given filters.
    //  */
    // async findAll(
    //     search: CodeQualitySearchDTO
    // ): Promise<PaginationResponseDTO<CodeQuality>> {
    //     try {
    //         logger.info("Searching for all codeQualitys");

    //         const whereClause = this._constructWhereClause(search);

    //         const { rows, count } = await CodeQuality.findAndCountAll({
    //             ...sequelizePagination(search.page || 1, search.limit || 10),
    //             where: whereClause,
    //         });

    //         logger.info("Successfully found all codeQualitys: ", {
    //             count,
    //         });

    //         return {
    //             results: rows,
    //             totalPages: Math.ceil(count / (search.limit || 10)) || 1,
    //         };
    //     } catch (error) {
    //         logger.error("Error finding all codeQualitys:", { error });
    //         throw new AppError("Failed to find all codeQualitys", 500, error);
    //     }
    // }
}
