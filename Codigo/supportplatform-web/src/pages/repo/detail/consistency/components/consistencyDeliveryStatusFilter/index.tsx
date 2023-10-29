import { Box, Select } from "@primer/react";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";
import { useSearchParams } from "react-router-dom";
import React from "react";

const pageRouteSearchParams = appRoutes.repo.detail.consistency.search;

const consistencyDeliveryStatusArray: Array<{
    status: ConsistencyRuleDeliveryStatus;
    name: string;
}> = [
    {
        status: ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        name: "Aguardando entrega",
    },
    {
        status: ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
        name: "Não entregue",
    },
    {
        status: ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        name: "Entregue com atraso",
    },
    {
        status: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        name: "Entregue no prazo",
    },
    {
        status: ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY,
        name: "Entregue com invalidade",
    },
];

interface IConsistencyDeliveryStatusFilterProps {
    evaluationMethodId: number | undefined;
}

export default function ConsistencyDeliveryStatusFilter(
    props: IConsistencyDeliveryStatusFilterProps
) {
    const [searchParams, setSearchParams] = useSearchParams();

    const statusParam = searchParams.get(pageRouteSearchParams.status) ?? "";
    const selectedStatus = consistencyDeliveryStatusArray.find(
        (statusObj) => statusObj.status.toString() === statusParam
    )?.status;

    function handleConsistencyDeliveryStatusSelectChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const deliveryStatus: string = event.target.value;
        setSearchParams((previousSearchParams) => {
            if (!deliveryStatus) {
                previousSearchParams.delete(pageRouteSearchParams.status);
            } else {
                previousSearchParams.set(
                    pageRouteSearchParams.status,
                    String(deliveryStatus)
                );
            }
            return previousSearchParams;
        });
    }

    return (
        <Box
            sx={{
                maxWidth: "150px",
            }}
        >
            <Select
                onChange={handleConsistencyDeliveryStatusSelectChange}
                disabled={!props.evaluationMethodId}
            >
                <Select.Option value="">
                    {selectedStatus ? "Limpar filtro" : "Filtrar por status"}
                </Select.Option>
                {consistencyDeliveryStatusArray.map((statusObj) => (
                    <Select.Option
                        key={statusObj.status.toString()}
                        value={statusObj.status.toString()}
                    >
                        {statusObj.name}
                    </Select.Option>
                ))}
            </Select>
        </Box>
    );
}
