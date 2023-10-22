import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";
import AppError from "../error/AppError";

export class ConsistencyRuleDeliveryStatusMapper {
    toDto(
        consistencyRuleDeliveryStatusFromModel: string
    ): ConsistencyRuleDeliveryStatus {
        if (
            !(
                consistencyRuleDeliveryStatusFromModel in
                ConsistencyRuleDeliveryStatus
            )
        ) {
            throw new AppError(
                `Unknown consistency rule delivery status: ${consistencyRuleDeliveryStatusFromModel}`,
                500
            );
        }
        return ConsistencyRuleDeliveryStatus[
            consistencyRuleDeliveryStatusFromModel as keyof typeof ConsistencyRuleDeliveryStatus
        ];
    }
}
