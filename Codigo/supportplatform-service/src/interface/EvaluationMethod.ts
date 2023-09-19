import { Op } from "sequelize";

export type EvaluationMethodWhereClauseType = {
    description?: { [Op.like]: string };
    semester?: number;
    year?: number;
    disabledAt?: Date | null;
};
