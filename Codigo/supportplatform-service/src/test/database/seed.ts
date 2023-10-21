import logger from "../../config/LogConfig";
import { ConsistencyRule } from "../../model/ConsistencyRule";
import { ConsistencyRuleDelivery } from "../../model/ConsistencyRuleDelivery";
import { EvaluationMethod } from "../../model/EvaluationMethod";
import { Repository } from "../../model/Repository";
import { Sprint } from "../../model/Sprint";

import { StandardizedIssue } from "../../model/StandardizedIssue";
import { consistencyRuleTestingSeed } from "../seed/consistencyRule";
import { consistencyRuleDeliveryTestingSeed } from "../seed/consistencyRuleDelivery";
import { evaluationMethodTestingSeed } from "../seed/evaluationMethod";
import { repositoryTestingSeed } from "../seed/repository";
import { sprintTestingSeed } from "../seed/sprint";
import { standardizedIssueTestingSeed } from "../seed/standardizedIssue";

export async function seedDatabase() {
    try {
        await Repository.bulkCreate(repositoryTestingSeed, {});
        await EvaluationMethod.bulkCreate(evaluationMethodTestingSeed, {});
        await Sprint.bulkCreate(sprintTestingSeed, {});
        await StandardizedIssue.bulkCreate(standardizedIssueTestingSeed, {});
        await ConsistencyRule.bulkCreate(consistencyRuleTestingSeed, {});
        await ConsistencyRuleDelivery.bulkCreate(
            consistencyRuleDeliveryTestingSeed,
            {}
        );
    } catch (error) {
        logger.error("Error seeding database:", { error });
        throw error;
    }
}
