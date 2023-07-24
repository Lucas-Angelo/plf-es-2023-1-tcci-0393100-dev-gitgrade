import logger from "../config/LogConfig";
import { IRepositoryAttributes, Repository } from "../model/Repository";
import { SequelizeUtil } from "../util/SequelizeUtil";

class RepositoryService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IRepositoryAttributes): Promise<Repository> {
        if (!data.githubId) throw new Error("githubId is required.");

        const existingRepository = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingRepository) {
            logger.info(
                "Repository already exists. Updating repository:",
                data
            );
            return await this.update(existingRepository, data);
        } else {
            logger.info(
                "Repository does not exist. Creating repository:",
                data
            );
            return await this.create(data);
        }
    }

    async create(data: IRepositoryAttributes): Promise<Repository> {
        try {
            this.validateNotNullAndEmptyFields(data);
            logger.info("Creating repository:", data);
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
            logger.error(
                `Error finding repository by ${field} ${value}:`,
                error
            );
            throw error;
        }
    }

    async findAll(): Promise<Repository[]> {
        try {
            logger.info("Searching for all repositories");
            const repositories = await Repository.findAll();
            return repositories;
        } catch (error) {
            logger.error("Error finding all repositories:", error);
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
            logger.error(errorMessage, data);
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { RepositoryService };
