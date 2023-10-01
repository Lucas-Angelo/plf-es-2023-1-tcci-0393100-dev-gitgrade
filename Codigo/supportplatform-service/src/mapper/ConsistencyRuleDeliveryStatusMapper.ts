import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";
import AppError from "../error/AppError";

export class ConsistencyRuleDeliveryStatusMapper {
    toDto(
        sonsistencyRuleDeliveryStatusFromModel: string
    ): ConsistencyRuleDeliveryStatus {
        if (
            !(
                sonsistencyRuleDeliveryStatusFromModel in
                ConsistencyRuleDeliveryStatus
            )
        ) {
            throw new AppError(
                `Unknown consistency rule delivery status: ${sonsistencyRuleDeliveryStatusFromModel}`,
                500
            );
        }
        return ConsistencyRuleDeliveryStatus[
            sonsistencyRuleDeliveryStatusFromModel as keyof typeof ConsistencyRuleDeliveryStatus
        ];
    }
}
