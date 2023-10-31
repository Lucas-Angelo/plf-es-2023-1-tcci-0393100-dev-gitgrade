import React, { useEffect, useState } from "react";
import { Box, ToggleSwitch } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { useToggle } from "../../../../../../../commom/hooks/useToggle";
import AlertModal from "../../../../../../../commom/components/alertModal";

interface IBranchAutomaticSyncToggleProps {
    children: React.ReactNode;
    ariaLabelledBy: string;
    defaultChecked: boolean;

    syncType: "file" | "commit";

    repositoryId: number;
    branchId: number;

    isDefaultBranch?: boolean;
}

export default function BranchAutomaticSyncToggle(
    props: IBranchAutomaticSyncToggleProps
) {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher();

    const fetcherError = fetcher.data as
        | (ErrorResponseDTO & {
              success?: boolean;
          })
        | undefined;

    const [renderToggle, reRender] = useToggle();

    // reset toggle when have error
    useEffect(() => {
        if (fetcherError && !fetcherError.success) {
            reRender();
        }
    }, [fetcherError, reRender]);

    function submitBranchAutomaticSync(checked: boolean) {
        const submitObject = {
            [props.syncType === "file"
                ? "fileAutomaticSynchronization"
                : "commitAutomaticSynchronization"]: checked,
        };
        fetcher.submit(submitObject, {
            method: "PATCH",
            encType: "application/json",
            action: appRoutes.repo.detail.config.branches.detail.link(
                props.repositoryId,
                props.branchId
            ),
        });
    }

    function handleBranchAutomaticSyncChange(checked: boolean) {
        if (checked && !props.isDefaultBranch) {
            setIsOpen(true);
        } else {
            submitBranchAutomaticSync(checked);
        }
    }

    function handleAlertModalCloseOrCancel() {
        setIsOpen(false);
        reRender();
    }

    function handleAlertModalConfirm() {
        setIsOpen(false);
        submitBranchAutomaticSync(true);
    }

    return (
        <Box
            sx={{ fontSize: 1 }}
            className="toggle-switch-wrapper"
        >
            {props.children}
            <ToggleSwitch
                key={renderToggle ? 1 : 2}
                sx={{ ml: 2 }}
                size="small"
                aria-labelledby={props.ariaLabelledBy}
                defaultChecked={props.defaultChecked}
                onChange={handleBranchAutomaticSyncChange}
            />

            <AlertModal
                onCancel={handleAlertModalCloseOrCancel}
                onClose={handleAlertModalCloseOrCancel}
                onConfirm={handleAlertModalConfirm}
                header="Ativar sincronização?"
                isOpen={isOpen}
            >
                Ao ativar a sincronização de{" "}
                {props.syncType === "commit" ? "commits" : "arquivos"} da
                branch, eles serão sincronizados sempre que houver uma
                sincronização manual ou automática no repositório. Essa é uma
                operação pesada, e pode não ser necessário para branches que não
                são a branch padrão. Ativar essa opção aumentará o tempo total
                de sincronização do repositório.
                <br />
                <br />
                <Box
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    Deseja ativar a sincronização?
                </Box>
            </AlertModal>
        </Box>
    );
}
