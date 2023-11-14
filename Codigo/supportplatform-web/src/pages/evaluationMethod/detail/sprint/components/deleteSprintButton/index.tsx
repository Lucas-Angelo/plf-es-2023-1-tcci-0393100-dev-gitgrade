import { Button } from "@primer/react";
import { useState } from "react";
import AlertModal from "../../../../../../commom/components/alertModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useFetcher } from "react-router-dom";

interface IDeleteSprintButtonProps {
    evaluationMethodId: number;
    sprintId: number;
}

export default function DeleteSprintButton(props: IDeleteSprintButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher();

    function submitSprintDelete() {
        fetcher.submit(null, {
            method: "DELETE",
            action: appRoutes.evaluationMethod.detail.sprint.detail.link(
                props.evaluationMethodId,
                props.sprintId
            ),
        });
    }

    function handleDeleteSprintButtonClick() {
        setIsOpen(true);
    }

    function handleAlertModalCloseOrCancel() {
        setIsOpen(false);
    }

    function handleAlertModalConfirm() {
        setIsOpen(false);
        submitSprintDelete();
    }
    return (
        <>
            <Button
                variant="danger"
                onClick={handleDeleteSprintButtonClick}
                disabled={fetcher.state === "submitting"}
            >
                Excluir
            </Button>
            <AlertModal
                onCancel={handleAlertModalCloseOrCancel}
                onClose={handleAlertModalCloseOrCancel}
                onConfirm={handleAlertModalConfirm}
                header="Excluir sprint?"
                isOpen={isOpen}
            >
                Essa ação é irreversível. Deseja mesmo prosseguir?
                <br />
                <br />
                <small>
                    * se a sprint estiver vinculada em alguma regra de
                    consistência, a operação não será concretizada.
                </small>
            </AlertModal>
        </>
    );
}
