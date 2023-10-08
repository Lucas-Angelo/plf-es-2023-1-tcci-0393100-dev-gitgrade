import { Op } from "sequelize";

export type StandardizedIssueWhereClauseType = {
    evaluationMethodId?: number;
    title?: { [Op.like]: string };
    description?: { [Op.like]: string };
};
