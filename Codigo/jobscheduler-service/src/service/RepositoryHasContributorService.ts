import logger from "../config/LogConfig";
import { RepositoryHasContributor } from "../model/RepositoryHasContributor";
import { ContributorService } from "./ContributorService";
import { RepositoryService } from "./RepositoryService";

class RepositoryHasContributorService {
    private readonly repositoryService: RepositoryService;
    private readonly contributorService: ContributorService;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.contributorService = new ContributorService();
    }

    async createAssociation(
        repositoryId: number,
        contributorId: number
    ): Promise<void> {
        try {
            const repository = await this.repositoryService.findOneByField(
                "id",
                repositoryId
            );
            if (!repository) {
                const errorMessage = `Repository with ID ${repositoryId} not found.`;
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const contributor = await this.contributorService.findOneByField(
                "id",
                contributorId
            );
            if (!contributor) {
                const errorMessage = `Contributor with ID ${contributorId} not found.`;
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const existingAssociation = await RepositoryHasContributor.findOne({
                where: {
                    repositoryId,
                    contributorId,
                },
            });

            if (existingAssociation) {
                logger.info("Association already exists:", {
                    existingAssociation,
                });
                return;
            }

            logger.info(
                "Creating new association between repository and contributor.",
                {
                    repositoryId,
                    contributorId,
                }
            );

            await RepositoryHasContributor.create({
                repositoryId,
                contributorId,
            });

            logger.info("Association created successfully.");
        } catch (error) {
            logger.error("Error creating association:", { error });
            throw error;
        }
    }
}

export { RepositoryHasContributorService };
