import { ConsistencyRuleDeliveryResponseDTO } from "@gitgrade/dtos";
import { ConsistencyRuleDelivery } from "../model/ConsistencyRuleDelivery";
import { ConsistencyRuleDeliveryStatusMapper } from "./ConsistencyRuleDeliveryStatusMapper";
import { ConsistencyRuleMapper } from "./ConsistencyRuleMapper";

export class ConsistencyRuleDeliveryMapper {
    private consistencyRuleDeliveryStatusMapper: ConsistencyRuleDeliveryStatusMapper;
    private consistencyRuleMapper: ConsistencyRuleMapper;

    constructor() {
        this.consistencyRuleDeliveryStatusMapper =
            new ConsistencyRuleDeliveryStatusMapper();
        this.consistencyRuleMapper = new ConsistencyRuleMapper();
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
            consistencyRule: this.consistencyRuleMapper.toDto(
                model.consistencyRule
            ),
        };
    };
}
