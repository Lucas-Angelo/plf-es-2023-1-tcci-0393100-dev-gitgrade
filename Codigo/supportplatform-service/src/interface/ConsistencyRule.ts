import { Op } from "sequelize";
import { ValidationType } from "../model/ConsistencyRule";

export type ConsistencyRuleWhereClauseType = {
    evaluationMethodId?: number;
    sprintId?: number;
    standardizedIssueId?: number;
    description?: { [Op.like]: string };
    filePath?: { [Op.like]: string };
    validationType?: ValidationType;
};
