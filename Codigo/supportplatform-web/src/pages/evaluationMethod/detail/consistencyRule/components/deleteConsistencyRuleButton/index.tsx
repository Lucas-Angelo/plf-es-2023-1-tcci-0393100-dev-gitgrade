import { Button } from "@primer/react";
import { useState } from "react";
import { useFetcher } from "react-router-dom";
import AlertModal from "../../../../../../commom/components/alertModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IDeleteConsistencyRuleButtonProps {
    evaluationMethodId: number;
    consistencyRuleId: number;
}

export default function DeleteConsistencyRuleButton(
    props: IDeleteConsistencyRuleButtonProps
) {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher();

    function submitSprintDelete() {
        fetcher.submit(null, {
            method: "DELETE",
            action: appRoutes.evaluationMethod.detail.consistencyRule.detail.link(
                props.evaluationMethodId,
                props.consistencyRuleId
            ),
        });
    }

    function handleDeleteConsistencyRuleButtonClick() {
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
                onClick={handleDeleteConsistencyRuleButtonClick}
                disabled={fetcher.state === "submitting"}
            >
                Excluir
            </Button>
            <AlertModal
                onCancel={handleAlertModalCloseOrCancel}
                onClose={handleAlertModalCloseOrCancel}
                onConfirm={handleAlertModalConfirm}
                header="Excluir regra de consistêcia?"
                isOpen={isOpen}
            >
                Essa ação é irreversível. Deseja mesmo prosseguir?
                <br />
                <br />
                <small>
                    * todos os registros de entrega dessa regra de consistência
                    dos repositórios serão excluídos
                </small>
            </AlertModal>
        </>
    );
}
