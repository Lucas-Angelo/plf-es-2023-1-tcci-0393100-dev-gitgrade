import { Op } from "sequelize";

export type SprintWhereClauseType = {
    start_date?: { [Op.gte]: Date };
    end_date?: { [Op.lte]: Date };
    evaluationMethodId?: number;
};
