import { Octicon } from "@primer/react";
import Card from "../../../../../../commom/components/card";
import { Button, Label } from "@primer/react";
import { MoonIcon, CalendarIcon } from "@primer/octicons-react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import DeleteSprintButton from "../deleteSprintButton";

interface ISprintCardProps {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    evaluationMethodId: number;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
});

export default function SprintCard(props: ISprintCardProps) {
    const [, setSearchParams] = useSearchParams();

    function handleEditSprintButtonClick() {
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(
                appRoutes.base.search.modal,
                appRoutes.base.searchValues.modal.editSprint
            );
            previousSearchParams.set(
                appRoutes.evaluationMethod.detail.sprint.detail.search.id,
                props.id.toString()
            );

            return previousSearchParams;
        });
    }

    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={MoonIcon}
                    sx={{ mr: 2 }}
                />
                {props.name}
                <Card.Labels>
                    <Label
                        variant="accent"
                        sx={{
                            mt: 2,
                            whiteSpace: "normal",
                            height: "auto",
                            minHeight: "20px",
                        }}
                    >
                        <Octicon
                            icon={CalendarIcon}
                            sx={{ mr: 2 }}
                        />
                        {dateTimeFormat.formatRange(
                            new Date(props.start_date),
                            new Date(props.end_date)
                        )}
                    </Label>
                </Card.Labels>
            </Card.Title>
            <Card.Actions>
                <DeleteSprintButton
                    evaluationMethodId={props.evaluationMethodId}
                    sprintId={props.id}
                />
                <Button
                    onClick={handleEditSprintButtonClick}
                    variant="primary"
                >
                    Editar
                </Button>
            </Card.Actions>
        </Card.Root>
    );
}
