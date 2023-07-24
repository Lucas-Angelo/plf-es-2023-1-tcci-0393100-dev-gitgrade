import logger from "../config/LogConfig";
import { IssueHasAssigneeContributor } from "../model/IssueHasAssigneeContributor";
import { IssueService } from "./IssueService";
import { ContributorService } from "./ContributorService";

class IssueHasAssigneeContributorService {
    private readonly issueService: IssueService;
    private readonly contributorService: ContributorService;

    constructor() {
        this.issueService = new IssueService();
        this.contributorService = new ContributorService();
    }

    async createAssociation(
        issueId: number,
        assigneeContributorId: number
    ): Promise<void> {
        try {
            const issue = await this.issueService.findOneByField("id", issueId);
            if (!issue) {
                const errorMessage = `Issue with ID ${issueId} not found.`;
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
                await IssueHasAssigneeContributor.findOne({
                    where: {
                        issueId,
                        assigneeContributorId,
                    },
                });

            if (existingAssociation) {
                logger.info("Association already exists:", existingAssociation);
                return;
            }

            logger.info(
                "Creating new association between issue and assigned contributor.",
                {
                    issueId,
                    assigneeContributorId,
                }
            );

            await IssueHasAssigneeContributor.create({
                issueId,
                assigneeContributorId,
            });

            logger.info("Association created successfully.");
        } catch (error) {
            logger.error("Error creating association:", error);
            throw error;
        }
    }
}

export { IssueHasAssigneeContributorService };
