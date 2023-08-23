import logger from "../config/LogConfig";
import { PullRequestHasAssigneeContributor } from "../model/PullRequestHasAssigneeContributor";
import { ContributorService } from "./ContributorService";
import { PullRequestService } from "./PullRequestService";

class PullRequestHasAssigneeContributorService {
    private readonly pullRequestService: PullRequestService;
    private readonly contributorService: ContributorService;

    constructor() {
        this.pullRequestService = new PullRequestService();
        this.contributorService = new ContributorService();
    }

    async createAssociation(
        pullRequestId: number,
        assigneeContributorId: number
    ): Promise<void> {
        try {
            const pullRequest = await this.pullRequestService.findOneByField(
                "id",
                pullRequestId
            );
            if (!pullRequest) {
                const errorMessage = `Pull Request with ID ${pullRequestId} not found.`;
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const assigneeContributor =
                await this.contributorService.findOneByField(
                    "id",
                    assigneeContributorId
                );
            if (!assigneeContributor) {
                const errorMessage = `Contributor with ID ${assigneeContributorId} not found.`;
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const existingAssociation =
                await PullRequestHasAssigneeContributor.findOne({
                    where: {
                        pullRequestId,
                        assigneeContributorId,
                    },
                });

            if (existingAssociation) {
                logger.info("Association already exists:", {
                    existingAssociation,
                });
                return;
            }

            logger.info(
                "Creating new association between pull request and assigned contributor.",
                {
                    pullRequestId,
                    assigneeContributorId,
                }
            );

            await PullRequestHasAssigneeContributor.create({
                pullRequestId,
                assigneeContributorId,
            });

            logger.info("Association created successfully.");
        } catch (error) {
            logger.error("Error creating association:", { error });
            throw error;
        }
    }
}

export { PullRequestHasAssigneeContributorService };
