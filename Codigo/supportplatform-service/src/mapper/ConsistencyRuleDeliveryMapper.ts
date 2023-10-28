import { ConsistencyRuleDeliveryResponseDTO } from "@gitgrade/dtos";
import { ConsistencyRuleDelivery } from "../model/ConsistencyRuleDelivery";
import { ConsistencyRuleDeliveryStatusMapper } from "./ConsistencyRuleDeliveryStatusMapper";
import { ConsistencyRuleMapper } from "./ConsistencyRuleMapper";
import { SprintMapper } from "./SprintMapper";

export class ConsistencyRuleDeliveryMapper {
    private consistencyRuleDeliveryStatusMapper: ConsistencyRuleDeliveryStatusMapper;
    private consistencyRuleMapper: ConsistencyRuleMapper;
    private sprintMapper: SprintMapper;

    constructor() {
        this.consistencyRuleDeliveryStatusMapper =
            new ConsistencyRuleDeliveryStatusMapper();
        this.consistencyRuleMapper = new ConsistencyRuleMapper();
        this.sprintMapper = new SprintMapper();
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
            consistencyRule: {
                ...this.consistencyRuleMapper.toDto(model.consistencyRule),
                sprint: this.sprintMapper.toDto(model.consistencyRule.sprint),
            },
        };
    };
}
