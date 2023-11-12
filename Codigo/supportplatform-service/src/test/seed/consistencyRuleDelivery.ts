import {
    ConsistencyRuleDeliveryStatus,
    IConsistencyRuleDeliveryAttributes,
} from "../../model/ConsistencyRuleDelivery";

const consistencyRuleDeliveryTestingSeed: IConsistencyRuleDeliveryAttributes[] =
    [
        {
            id: 1,
            consistencyRuleId: 1,
            repositoryId: 1,
            deliveryAt: null,
            status: ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        },
        {
            id: 2,
            consistencyRuleId: 1,
            repositoryId: 1,
            deliveryAt: new Date("2023-10-01"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        },
        {
            id: 3,
            consistencyRuleId: 1,
            repositoryId: 1,
            deliveryAt: new Date("2023-10-01"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        },
        {
            id: 4,
            consistencyRuleId: 1,
            repositoryId: 1,
            deliveryAt: null,
            status: ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
        },
        {
            id: 5,
            consistencyRuleId: 1,
            repositoryId: 1,
            deliveryAt: new Date("2023-10-01"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY,
        },
        {
            id: 6,
            consistencyRuleId: 2,
            repositoryId: 2,
            deliveryAt: null,
            status: ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        },
        {
            id: 7,
            consistencyRuleId: 2,
            repositoryId: 2,
            deliveryAt: new Date("2023-10-10"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        },
        {
            id: 8,
            consistencyRuleId: 2,
            repositoryId: 2,
            deliveryAt: new Date("2023-10-10"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        },
        {
            id: 9,
            consistencyRuleId: 2,
            repositoryId: 2,
            deliveryAt: null,
            status: ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
        },
        {
            id: 10,
            consistencyRuleId: 2,
            repositoryId: 2,
            deliveryAt: new Date("2023-10-10"),
            status: ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY,
        },
        {
            id: 11,
            consistencyRuleId: 8,
            repositoryId: 2,
            deliveryAt: null,
            status: ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        },
    ];

export { consistencyRuleDeliveryTestingSeed };
