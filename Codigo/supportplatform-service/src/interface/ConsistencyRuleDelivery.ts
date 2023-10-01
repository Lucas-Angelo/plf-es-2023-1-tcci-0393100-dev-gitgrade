import { Op } from "sequelize";

export type ConsistencyRuleDeliveryWhereClauseType = {
    deliveryAt?: { [Op.gte]: Date } | { [Op.lte]: Date } | Date;
    consistencyRuleId?: number;
    repositoryId?: number;
};
