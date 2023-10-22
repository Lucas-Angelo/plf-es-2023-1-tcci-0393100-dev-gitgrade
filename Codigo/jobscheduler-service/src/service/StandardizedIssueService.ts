import logger from "../config/LogConfig";
import {
    IStandardizedIssueAttributes,
    StandardizedIssue,
} from "../model/StandardizedIssue";

class StandardizedIssueService {
    async findOneByFields(
        fields: Partial<IStandardizedIssueAttributes>
    ): Promise<StandardizedIssue | null> {
        logger.info("Finding standardized issue by fields:", { fields });
        try {
            const standardizedIssue = await StandardizedIssue.findOne({
                where: fields,
            });

            logger.info("Standardized issue found:", { standardizedIssue });

            return standardizedIssue;
        } catch (error) {
            logger.error("Error fetching standardized issue:", { error });
            throw error;
        }
    }
}

export { StandardizedIssueService };
