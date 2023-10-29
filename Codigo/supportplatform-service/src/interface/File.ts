import { Op, WhereOptions } from "sequelize";
import { Where } from "sequelize/types/utils";
import { Contributor } from "../model/Contributor";

export type FileWhereClauseType = {
    [Op.and]: Array<
        | {
              ["$commit.committed_date$"]?:
                  | { [Op.between]: [Date] }
                  | { [Op.gte]: Date }
                  | { [Op.lte]: Date };
          }
        | { ["$commit.branch.repository_id$"]?: number }
        | { ["$commit.branch.name$"]?: string }
        | { path: string }
        | Where
        | WhereOptions
    >;
};

export type FileFindAllServiceResponse = {
    path: string;
    extension: string | null;
    additions: number;
    deletions: number;
    contributors?: Array<Contributor | null | undefined>;
};
