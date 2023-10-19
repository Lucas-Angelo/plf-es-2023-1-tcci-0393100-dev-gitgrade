import { Octicon, Truncate } from "@primer/react";
import Card from "../../../../../../commom/components/card";
import { Button, Label } from "@primer/react";
import {
    MoonIcon,
    IssueOpenedIcon,
    TasklistIcon,
    FileIcon,
} from "@primer/octicons-react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useEvaluationMethodSprintById } from "../../../../../../commom/data/sprint";

interface IConsistencyRuleCardProps {
    id: number;
    description: string;
    standardizedIssueId?: number;
    filePath: string;
    evaluationMethodId: number;
    sprintId: number;
}

export default function ConsistencyRuleCard(props: IConsistencyRuleCardProps) {
    const [, setSearchParams] = useSearchParams();
    function handleEditConsistencyRuleButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal.editConsistencyRule,
            [appRoutes.evaluationMethod.detail.consistencyRule.detail.search
                .id]: props.id.toString(),
        }));
    }

    const { data: sprintData } = useEvaluationMethodSprintById(
        props.evaluationMethodId,
        props.sprintId
    );

    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={TasklistIcon}
                    sx={{ mr: 2 }}
                />
                {props.description}

                <Card.Labels>
                    <Label sx={{ mt: 2 }}>
                        <Octicon
                            icon={FileIcon}
                            sx={{ mr: 2 }}
                        />
                        <Truncate
                            maxWidth={150}
                            title={props.filePath}
                        >
                            {props.filePath}
                        </Truncate>
                    </Label>
                </Card.Labels>
            </Card.Title>
            <Card.Labels>
                <Label
                    variant="accent"
                    sx={{
                        whiteSpace: "normal",
                        height: "auto",
                        minHeight: "20px",
                    }}
                >
                    <Octicon
                        icon={MoonIcon}
                        sx={{ mr: 2 }}
                    />
                    <Truncate
                        title={sprintData?.name ?? "..."}
                        maxWidth={100}
                    >
                        {sprintData?.name ?? "..."}
                    </Truncate>
                </Label>
                {props.standardizedIssueId && (
                    <Label
                        variant="sponsors"
                        sx={{
                            ml: 2,
                        }}
                    >
                        <Octicon icon={IssueOpenedIcon} />
                    </Label>
                )}
            </Card.Labels>
            <Card.Actions>
                <Button
                    variant="danger"
                    disabled
                >
                    Excluir
                </Button>
                <Button
                    onClick={handleEditConsistencyRuleButtonClick}
                    variant="primary"
                >
                    Editar
                </Button>
            </Card.Actions>
        </Card.Root>
    );
}
