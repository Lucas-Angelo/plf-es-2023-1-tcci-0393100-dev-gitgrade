import logger from "../config/LogConfig";
import { Contributor, IContributorAttributes } from "../model/Contributor";
import { SequelizeUtil } from "../util/SequelizeUtil";

class ContributorService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IContributorAttributes): Promise<Contributor> {
        if (!data.githubId) throw new Error("githubId is required.");

        const existingContributor = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingContributor) {
            logger.info(
                "Contributor already exists. Updating contributor:",
                data
            );
            return await this.update(existingContributor, data);
        } else {
            logger.info(
                "Contributor does not exist. Creating contributor:",
                data
            );
            return await this.create(data);
        }
    }

    async create(data: IContributorAttributes): Promise<Contributor> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating contributor:", data);
            const contributor = await Contributor.create(data);
            logger.info("Contributor created:", {
                contributor,
            });
            return contributor;
        } catch (error) {
            logger.error("Error creating contributor:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(
        existingContributor: Contributor,
        data: IContributorAttributes
    ): Promise<Contributor> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating contributor:", {
                existingContributor,
                newData: data,
            });
            const updatedContributor = await existingContributor.update(data);
            logger.info("Contributor updated:", {
                updatedContributor,
            });
            return updatedContributor;
        } catch (error) {
            logger.error("Error updating contributor:", {
                existingContributor,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IContributorAttributes,
        value: IContributorAttributes[keyof IContributorAttributes]
    ): Promise<Contributor | null> {
        try {
            logger.info(`Searching for contributor by ${field} ${value}`);
            const contributor = await Contributor.findOne({
                where: { [field]: value },
            });
            if (!contributor)
                logger.info(
                    `Contributor not found by ${field} ${value}. Returning null.`
                );
            else
                logger.info(`Contributor found by ${field} ${value}:`, {
                    contributor,
                });

            return contributor;
        } catch (error) {
            logger.error(
                `Error finding contributor by ${field} ${value}:`,
                error
            );
            throw error;
        }
    }

    async findAll(): Promise<Contributor[]> {
        try {
            logger.info("Searching for all contributors");
            const contributors = await Contributor.findAll();
            return contributors;
        } catch (error) {
            logger.error("Error finding all contributors:", error);
            throw error;
        }
    }

    private validateNotNullFields(data: IContributorAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            Contributor,
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

export { ContributorService };
