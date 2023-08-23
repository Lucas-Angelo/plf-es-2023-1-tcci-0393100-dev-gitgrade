import logger from "../config/LogConfig";
import { IIssueAttributes, Issue } from "../model/Issue";
import { SequelizeUtil } from "../util/SequelizeUtil";

class IssueService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IIssueAttributes): Promise<Issue> {
        if (!data.githubId) {
            logger.error("Issue githubId is required.", { data });
            throw new Error("Issue githubId is required.");
        }

        const existingIssue = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingIssue) return await this.update(existingIssue, data);
        else return await this.create(data);
    }

    async create(data: IIssueAttributes): Promise<Issue> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating issue:", { data });
            const issue = await Issue.create(data);
            logger.info("Issue created:", {
                issue,
            });
            return issue;
        } catch (error) {
            logger.error("Error creating issue:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(existingIssue: Issue, data: IIssueAttributes): Promise<Issue> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating issue:", {
                existingIssue,
                newData: data,
            });
            const updatedIssue = await existingIssue.update(data);
            logger.info("Issue updated:", {
                updatedIssue,
            });
            return updatedIssue;
        } catch (error) {
            logger.error("Error updating issue:", {
                existingIssue,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IIssueAttributes,
        value: IIssueAttributes[keyof IIssueAttributes]
    ): Promise<Issue | null> {
        try {
            logger.info(`Searching for issue by ${field} ${value}`);
            const issue = await Issue.findOne({
                where: { [field]: value },
            });
            if (!issue)
                logger.info(
                    `Issue not found by ${field} ${value}. Returning null.`
                );
            else logger.info(`Issue found by ${field} ${value}:`, { issue });
            return issue;
        } catch (error) {
            logger.error(`Error finding issue by ${field} ${value}:`, {
                error,
            });
            throw error;
        }
    }

    private validateNotNullFields(data: IIssueAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(Issue, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { IssueService };
