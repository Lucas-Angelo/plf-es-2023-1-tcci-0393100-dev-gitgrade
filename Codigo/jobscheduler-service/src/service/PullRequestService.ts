import logger from "../config/LogConfig";
import { IPullRequestAttributes, PullRequest } from "../model/PullRequest";
import { SequelizeUtil } from "../util/SequelizeUtil";

class PullRequestService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IPullRequestAttributes): Promise<PullRequest> {
        if (!data.title) throw new Error("Pull request title is required.");

        const existingPullRequest = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingPullRequest) {
            logger.info(
                "Pull request already exists. Updating pull request:",
                data
            );
            return await this.update(existingPullRequest, data);
        } else {
            logger.info(
                "Pull request does not exist. Creating pull request:",
                data
            );
            return await this.create(data);
        }
    }

    async create(data: IPullRequestAttributes): Promise<PullRequest> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating pull request:", data);
            const pullRequest = await PullRequest.create(data);
            logger.info("Pull request created:", {
                pullRequest,
            });
            return pullRequest;
        } catch (error) {
            logger.error("Error creating pull request:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(
        existingPullRequest: PullRequest,
        data: IPullRequestAttributes
    ): Promise<PullRequest> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating pull request:", {
                existingPullRequest,
                newData: data,
            });
            const updatedPullRequest = await existingPullRequest.update(data);
            logger.info("Pull request updated:", {
                updatedPullRequest,
            });
            return updatedPullRequest;
        } catch (error) {
            logger.error("Error updating pull request:", {
                existingPullRequest,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IPullRequestAttributes,
        value: IPullRequestAttributes[keyof IPullRequestAttributes]
    ): Promise<PullRequest | null> {
        try {
            logger.info(`Searching for pull request by ${field} ${value}`);
            const pullRequest = await PullRequest.findOne({
                where: { [field]: value },
            });
            if (!pullRequest)
                logger.info(
                    `Pull request not found by ${field} ${value}. Returning null.`
                );
            else
                logger.info(
                    `Pull request found by ${field} ${value}:`,
                    pullRequest
                );

            return pullRequest;
        } catch (error) {
            logger.error(
                `Error finding pull request by ${field} ${value}:`,
                error
            );
            throw error;
        }
    }

    private validateNotNullFields(data: IPullRequestAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(
            PullRequest,
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

export { PullRequestService };
