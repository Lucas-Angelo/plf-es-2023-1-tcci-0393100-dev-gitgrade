import { Op } from "sequelize";
import { CodeQualityStatus } from "../model/CodeQuality";

export type CodeQualityWhereClauseType = {
    repositoryId: number;
    url?: { [Op.like]: string };
    status?: CodeQualityStatus;
    createdAt?: Date;
};
