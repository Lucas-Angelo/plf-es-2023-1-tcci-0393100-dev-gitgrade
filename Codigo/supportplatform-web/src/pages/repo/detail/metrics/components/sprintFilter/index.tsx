import { SprintResponseDTO } from "@gitgrade/dtos";
import { useEvaluationMethodSprintList } from "../../../../../../commom/data/sprint";
import {
    Truncate,
    ActionMenu,
    ActionList,
    Text,
    Spinner,
    Box,
} from "@primer/react";

interface ISprintFilterProps {
    evaluationMethodId: number;

    selectedSprint?: SprintResponseDTO;
    onSelectedSprintSelect?: (sprintId: SprintResponseDTO) => void;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
});

export default function SprintFilter(props: ISprintFilterProps) {
    const { data: sprintList, isLoading } = useEvaluationMethodSprintList(
        props.evaluationMethodId,
        {
            limit: 1000,
        }
    );

    const sprint =
        props.selectedSprint &&
        sprintList?.results.some(
            (sprint) => sprint.id === props.selectedSprint?.id
        )
            ? props.selectedSprint
            : undefined;

    return (
        <ActionMenu>
            <ActionMenu.Button>
                <Truncate
                    maxWidth={100}
                    title={sprint?.name ?? "Filtrar sprint"}
                >
                    {sprint?.name ?? "Filtrar sprint"}
                </Truncate>
            </ActionMenu.Button>

            <ActionMenu.Overlay>
                <ActionList>
                    {isLoading && (
                        <ActionList.Item disabled>
                            Carregando <Spinner />
                        </ActionList.Item>
                    )}
                    {sprintList?.results.map((sprint) => (
                        <ActionList.Item
                            key={sprint.id.toString()}
                            onSelect={() =>
                                props.onSelectedSprintSelect?.(sprint)
                            }
                        >
                            <Text sx={{ fontWeight: "bold" }}>
                                {sprint.name}
                                <Box
                                    sx={{
                                        fontSize: 12,
                                        color: "gray",
                                    }}
                                >
                                    (
                                    {dateTimeFormat.formatRange(
                                        new Date(sprint.start_date),
                                        new Date(sprint.end_date)
                                    )}
                                    )
                                </Box>
                            </Text>
                        </ActionList.Item>
                    ))}
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
}
