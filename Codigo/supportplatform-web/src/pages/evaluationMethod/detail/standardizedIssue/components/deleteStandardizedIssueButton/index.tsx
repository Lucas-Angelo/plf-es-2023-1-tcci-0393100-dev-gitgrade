import { Button } from "@primer/react";
import AlertModal from "../../../../../../commom/components/alertModal";
import { useState } from "react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IDeleteStandardizedIssueButtonProps {
    evaluationMethodId: number;
    standardizedIssueId: number;
}

export default function DeleteStandardizedIssueButton(
    props: IDeleteStandardizedIssueButtonProps
) {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher();

    function submitStandardizedIssueDelete() {
        fetcher.submit(null, {
            method: "DELETE",
            action: appRoutes.evaluationMethod.detail.standardizedIssue.detail.link(
                props.evaluationMethodId,
                props.standardizedIssueId
            ),
        });
    }

    function handleDeleteStandardizedIssueButtonClick() {
        setIsOpen(true);
    }

    function handleAlertModalCloseOrCancel() {
        setIsOpen(false);
    }

    function handleAlertModalConfirm() {
        setIsOpen(false);
        submitStandardizedIssueDelete();
    }
    return (
        <>
            <Button
                variant="danger"
                onClick={handleDeleteStandardizedIssueButtonClick}
                disabled={fetcher.state === "submitting"}
            >
                Excluir
            </Button>
            <AlertModal
                onCancel={handleAlertModalCloseOrCancel}
                onClose={handleAlertModalCloseOrCancel}
                onConfirm={handleAlertModalConfirm}
                header="Excluir issue padronizada?"
                isOpen={isOpen}
            >
                Essa ação é irreversível. Deseja mesmo prosseguir?
                <br />
                <br />
                <small>
                    * se a issue padronizada estiver vinculada em alguma regra
                    de consistência, a operação não será concretizada.
                </small>
            </AlertModal>
        </>
    );
}
