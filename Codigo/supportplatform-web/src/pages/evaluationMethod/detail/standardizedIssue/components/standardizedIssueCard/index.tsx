import { Octicon } from "@primer/react";
import Card from "../../../../../../commom/components/card";
import { Button } from "@primer/react";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import DeleteStandardizedIssueButton from "../deleteStandardizedIssueButton";

interface IStandardizedIssueCardProps {
    id: number;
    title: string;
    evaluationMethodId: number;
}

export default function StandardizedIssueCard(
    props: IStandardizedIssueCardProps
) {
    const [, setSearchParams] = useSearchParams();
    function handleEditStandardizedIssueButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal.editStandardizedIssue,
            [appRoutes.evaluationMethod.detail.standardizedIssue.detail.search
                .id]: props.id.toString(),
        }));
    }

    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={IssueOpenedIcon}
                    sx={{ mr: 2 }}
                />
                {props.title}
            </Card.Title>
            <Card.Actions>
                <DeleteStandardizedIssueButton
                    standardizedIssueId={props.id}
                    evaluationMethodId={props.evaluationMethodId}
                />
                <Button
                    onClick={handleEditStandardizedIssueButtonClick}
                    variant="primary"
                >
                    Editar
                </Button>
            </Card.Actions>
        </Card.Root>
    );
}
