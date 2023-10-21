import logger from "../config/LogConfig";
import {
    ConsistencyRule,
    IConsistencyRuleAttributes,
} from "../model/ConsistencyRule";

class ConsistencyRuleService {
    async findAllConsistencyRulesByFields(
        fields: Partial<IConsistencyRuleAttributes>
    ): Promise<ConsistencyRule[]> {
        logger.info("Finding consistency rules by fields:", { fields });
        try {
            const consistencyRules = await ConsistencyRule.findAll({
                where: fields,
            });

            logger.info("Consistency rules found:", { consistencyRules });

            return consistencyRules;
        } catch (error) {
            logger.error("Error fetching consistency rules:", { error });
            throw error;
        }
    }
}

export { ConsistencyRuleService };
