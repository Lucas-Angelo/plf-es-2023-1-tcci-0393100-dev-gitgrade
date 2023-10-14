import { Op } from "sequelize";
import { Where } from "sequelize/types/utils";

export type RepositoryWhereClauseType = {
    [Op.and]?: Array<Where | { evaluationMethodId: number | null }>;
};
