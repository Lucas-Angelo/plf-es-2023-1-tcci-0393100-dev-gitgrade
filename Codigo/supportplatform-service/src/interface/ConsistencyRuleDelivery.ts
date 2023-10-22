import { Op } from "sequelize";
import { ConsistencyRuleDeliveryStatus } from "../model/ConsistencyRuleDelivery";

export type ConsistencyRuleDeliveryWhereClauseType = {
    deliveryAt?: { [Op.gte]: Date } | { [Op.lte]: Date } | Date;
    consistencyRuleId?: number;
    repositoryId?: number;
    status?: ConsistencyRuleDeliveryStatus;
};
