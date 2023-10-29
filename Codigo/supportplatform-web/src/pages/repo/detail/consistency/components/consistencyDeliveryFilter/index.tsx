import { useSearchParams } from "react-router-dom";
import SprintFilter from "../../../../../../commom/components/sprintFilter";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useEvaluationMethodSprintById } from "../../../../../../commom/data/sprint";
import { Box } from "@primer/react";
import { SprintResponseDTO } from "@gitgrade/dtos";
import ConsistencyDeliveryStatusFilter from "../consistencyDeliveryStatusFilter";
import ConsistencyRuleFilter from "../consistencyRuleFilter";

const pageRouteSearchParams = appRoutes.repo.detail.consistency.search;

interface IConsistencyDeliveryFilterProps {
    evaluationMethodId: number | undefined;
}

export default function ConsistencyDeliveryFilter(
    props: IConsistencyDeliveryFilterProps
) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sprintParam = searchParams.get(pageRouteSearchParams.sprint) ?? "";
    const sprintId = Number(sprintParam) || undefined;

    const { data: selectedSprint } = useEvaluationMethodSprintById(
        props.evaluationMethodId!,
        sprintId!,
        {
            enabled: Boolean(sprintId && props.evaluationMethodId),
        }
    );

    function handleSprintSelectChange(sprint: SprintResponseDTO | undefined) {
        setSearchParams((previousSearchParams) => {
            if (!sprint) {
                previousSearchParams.delete(pageRouteSearchParams.sprint);
            } else {
                previousSearchParams.set(
                    pageRouteSearchParams.sprint,
                    String(sprint?.id)
                );
            }
            return previousSearchParams;
        });
    }

    return (
        <Box
            sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
            }}
        >
            <ConsistencyDeliveryStatusFilter
                evaluationMethodId={props.evaluationMethodId}
            />
            <SprintFilter
                evaluationMethodId={props.evaluationMethodId}
                onSelectedSprintSelect={handleSprintSelectChange}
                selectedSprint={selectedSprint}
            />
            <ConsistencyRuleFilter
                evaluationMethodId={props.evaluationMethodId}
            />
        </Box>
    );
}
