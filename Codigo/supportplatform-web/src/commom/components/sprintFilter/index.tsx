import { SprintResponseDTO } from "@gitgrade/dtos";
import { useEvaluationMethodSprintList } from "../../data/sprint";
import { Select, Box } from "@primer/react";

interface ISprintFilterProps {
    evaluationMethodId: number | undefined;

    selectedSprint?: SprintResponseDTO;
    onSelectedSprintSelect?: (sprintId: SprintResponseDTO | undefined) => void;
}

export default function SprintFilter(props: ISprintFilterProps) {
    const { data: sprintList, isLoading } = useEvaluationMethodSprintList(
        props.evaluationMethodId!,
        {
            limit: 1000,
        },
        Boolean(props.evaluationMethodId)
    );

    const sprint =
        props.selectedSprint &&
        sprintList?.results.some(
            (sprint) => sprint.id === props.selectedSprint?.id
        )
            ? props.selectedSprint
            : undefined;

    function handleSprintSelectChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const sprintId = parseInt(event.target.value);
        const sprint = sprintList?.results.find(
            (sprint) => sprint.id == sprintId
        );
        props.onSelectedSprintSelect?.(sprint);
    }

    return (
        <Box
            sx={{
                maxWidth: "150px",
            }}
        >
            <Select
                value={sprint?.id.toString()}
                sx={{
                    maxWidth: "300px",
                }}
                onChange={handleSprintSelectChange}
                disabled={!props.evaluationMethodId}
            >
                {isLoading && (
                    <Select.Option
                        value="-1"
                        disabled
                    >
                        Carregando...
                    </Select.Option>
                )}
                <Select.Option value="0">
                    {sprint ? "Limpar filtro" : "Filtrar por sprint"}
                </Select.Option>
                {sprintList?.results.map((sprint) => (
                    <Select.Option
                        key={sprint.id}
                        value={sprint.id.toString()}
                    >
                        {sprint.name}
                    </Select.Option>
                ))}
            </Select>
        </Box>
    );
}
