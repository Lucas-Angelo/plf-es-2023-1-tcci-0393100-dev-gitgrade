import logger from "../config/LogConfig";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { IRepositoryAttributes, Repository } from "../model/Repository";
import { SequelizeUtil } from "../util/SequelizeUtil";

class RepositoryService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IRepositoryAttributes): Promise<Repository> {
        if (!data.githubId) {
            logger.error("githubId is required.", { data });
            throw new Error("githubId is required.");
        }

        const existingRepository = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingRepository)
            return await this.update(existingRepository, data);
        else return await this.create(data);
    }

    async create(data: IRepositoryAttributes): Promise<Repository> {
        try {
            data.automaticSynchronization = true;
            data.synchronizing = true;
            this.validateNotNullAndEmptyFields(data);
            logger.info("Creating repository:", { data });
            const repository = await Repository.create(data);
            logger.info("Repository created:", {
                repository,
            });
            return repository;
        } catch (error) {
            logger.error("Error creating repository:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(
        existingRepository: Repository,
        data: IRepositoryAttributes
    ): Promise<Repository> {
        try {
            this.validateNotNullAndEmptyFields(data);
            logger.info("Updating repository:", {
                existingRepository,
                newData: data,
            });
            const updatedRepository = await existingRepository.update(data);
            logger.info("Repository updated:", {
                updatedRepository,
            });
            return updatedRepository;
        } catch (error) {
            logger.error("Error updating repository:", {
                existingRepository,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IRepositoryAttributes,
        value: IRepositoryAttributes[keyof IRepositoryAttributes]
    ): Promise<Repository | null> {
        try {
            logger.info(`Searching for repository by ${field} ${value}`);
            const repository = await Repository.findOne({
                where: { [field]: value },
            });
            if (!repository)
                logger.info(
                    `Repository not found by ${field} ${value}. Returning null.`
                );
            else
                logger.info(`Repository found by ${field} ${value}:`, {
                    repository,
                });
            return repository;
        } catch (error) {
            logger.error(`Error finding repository by ${field} ${value}:`, {
                error,
            });
            throw error;
        }
    }

    async findAllByField(
        field: keyof IRepositoryAttributes,
        value:
            | IRepositoryAttributes[keyof IRepositoryAttributes]
            | Array<IRepositoryAttributes[keyof IRepositoryAttributes]>
    ): Promise<Array<Repository>> {
        try {
            logger.info(`Searching for repositories by ${field} ${value}`);
            const repositories = await Repository.findAll({
                where: { [field]: value },
            });
            logger.info(`Repositories found by ${field} ${value}:`, {
                repositories,
            });
            return repositories;
        } catch (error) {
            logger.error(`Error finding repositories by ${field} ${value}:`, {
                error,
            });
            throw error;
        }
    }

    async findAllWithAutomaticSynchronizationEnable(): Promise<Repository[]> {
        try {
            logger.info(
                "Searching for repositories with automatic sync true..."
            );
            const repositories = await Repository.findAll({
                where: { automaticSynchronization: true },
            });
            logger.info("Repositories found:", { repositories });
            return repositories;
        } catch (error) {
            logger.error(
                "Error finding repositories with automatic sync true:",
                {
                    error,
                }
            );
            throw error;
        }
    }

    async setAllAutomaticSynchronizationEnableRepositoriesToSynchronizingTrue(): Promise<
        Repository[]
    > {
        try {
            logger.info(
                "Setting all repositories with automatic sync true to synchronizing true..."
            );
            const repositoriesWithAutomaticSynchronizationEnabled =
                await this.findAllWithAutomaticSynchronizationEnable();
            for (const repository of repositoriesWithAutomaticSynchronizationEnabled)
                await repository.update({ synchronizing: true });
            logger.info(
                "All repositories with automatic sync true set to synchronizing true."
            );
            return repositoriesWithAutomaticSynchronizationEnabled;
        } catch (error) {
            logger.error(
                "Error setting all repositories with automatic sync true to synchronizing true:",
                {
                    error,
                }
            );
            throw error;
        }
    }

    async setAllRepositoriesByIdToSynchronizingTrue(
        repositoryIds: number[]
    ): Promise<Repository[]> {
        try {
            logger.info(
                "Setting all repositories to synchronizing true...",
                repositoryIds
            );
            await Repository.update(
                { synchronizing: true },
                { where: { id: repositoryIds } }
            );
            logger.info("Repositories set to synchronizing true.", {
                repositoryIds,
            });
            return Repository.findAll({
                where: { id: repositoryIds },
            });
        } catch (error) {
            logger.error(
                "Error setting all repositories to synchronizing true:",
                {
                    error,
                }
            );
            throw error;
        }
    }

    async setAllRepositoriesToSynchronizingFalse(
        repositories: Repository[]
    ): Promise<void> {
        try {
            logger.info("Setting all repositories to synchronizing false...");
            for (const repository of repositories)
                await repository.update({ synchronizing: false });
            logger.info("All repositories set to synchronizing false.");
        } catch (error) {
            logger.error(
                "Error setting all repositories to synchronizing false:",
                {
                    error,
                }
            );
            throw error;
        }
    }

    async findAllRepositoriesWithEvaluationMethod(where?: {
        id?: number | number[];
    }): Promise<Repository[]> {
        try {
            logger.info("Searching for repositories with evaluation method...");
            const repositories = await Repository.findAll({
                include: [
                    {
                        model: EvaluationMethod,
                        as: "evaluationMethod",
                        where: {
                            disabledAt: null,
                        },
                        required: true,
                    },
                ],
                where,
            });
            logger.info(
                "Quantity of repositories found with evaluation method:",
                {
                    quantity: repositories.length,
                }
            );
            return repositories;
        } catch (error) {
            logger.error("Error finding repositories with evaluation method:", {
                error,
            });
            throw error;
        }
    }

    private validateNotNullAndEmptyFields(data: IRepositoryAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            Repository,
            data
        );

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { RepositoryService };
