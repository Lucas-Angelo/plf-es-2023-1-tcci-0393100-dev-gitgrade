import { ConsistencyRuleDeliveryResponseDTO } from "@gitgrade/dtos";
import { ConsistencyRuleDelivery } from "../model/ConsistencyRuleDelivery";

export class ConsistencyRuleDeliveryMapper {
    toDto(model: ConsistencyRuleDelivery): ConsistencyRuleDeliveryResponseDTO {
        return {
            id: model.id,
            consistencyRuleId: model.consistencyRuleId,
            repositoryId: model.repositoryId,
            deliveryAt: model.deliveryAt,
        };
    }
}
