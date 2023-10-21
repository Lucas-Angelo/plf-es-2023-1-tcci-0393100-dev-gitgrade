import { ConsistencyRuleDeliveryResponseDTO } from "@gitgrade/dtos";
import { ConsistencyRuleDelivery } from "../model/ConsistencyRuleDelivery";
import { ConsistencyRuleDeliveryStatusMapper } from "./ConsistencyRuleDeliveryStatusMapper";

export class ConsistencyRuleDeliveryMapper {
    private consistencyRuleDeliveryStatusMapper: ConsistencyRuleDeliveryStatusMapper;

    constructor() {
        this.consistencyRuleDeliveryStatusMapper =
            new ConsistencyRuleDeliveryStatusMapper();
    }

    toDto = (
        model: ConsistencyRuleDelivery
    ): ConsistencyRuleDeliveryResponseDTO => {
        return {
            id: model.id,
            consistencyRuleId: model.consistencyRuleId,
            repositoryId: model.repositoryId,
            deliveryAt: model.deliveryAt,
            status: this.consistencyRuleDeliveryStatusMapper.toDto(
                model.status
            ),
        };
    };
}
