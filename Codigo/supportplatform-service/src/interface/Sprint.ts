import { Op } from "sequelize";
import { Where } from "sequelize/types/utils";

export type SprintWhereClauseType = {
    [Op.and]: Array<
        | { start_date?: { [Op.gte]: Date } }
        | { end_date?: { [Op.lte]: Date } }
        | { evaluationMethodId?: number }
        | Where
    >;
};
