import { Op, WhereOptions } from "sequelize";
import { Where } from "sequelize/types/utils";

export type CommitWhereClauseType = {
    [Op.and]: Array<
        | {
              committedDate?:
                  | { [Op.between]: [Date] }
                  | { [Op.gte]: Date }
                  | { [Op.lte]: Date };
          }
        | { ["$branch.repository_id$"]?: number }
        | { ["$branch.name$"]?: string }
        | { message: string }
        | Where
        | WhereOptions
    >;
};
