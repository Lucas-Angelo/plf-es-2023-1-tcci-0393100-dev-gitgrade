import logger from "../config/LogConfig";
import { ISprintAttributes, Sprint } from "../model/Sprint";

class SprintService {
    async findOneByFields(
        fields: Partial<ISprintAttributes>
    ): Promise<Sprint | null> {
        logger.info("Finding sprint by fields:", { fields });
        try {
            const sprint = await Sprint.findOne({
                where: fields,
            });

            logger.info("Sprint found:", { sprint });

            return sprint;
        } catch (error) {
            logger.error("Error fetching sprint:", { error });
            throw error;
        }
    }
}

export { SprintService };
