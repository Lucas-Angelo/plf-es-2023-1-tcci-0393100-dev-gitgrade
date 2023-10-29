import { Box, ToggleSwitch } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { useToggle } from "../../../../../../../commom/hooks/useToggle";
import { useEffect, useState } from "react";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import AlertModal from "../../../../../../../commom/components/alertModal";

interface IRepositoryAutoSyncToggleProps {
    repositoryId: number;
    automaticSynchronization: boolean;
}

export default function RepositoryAutoSyncToggle(
    props: IRepositoryAutoSyncToggleProps
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

    function submitAutomaticSyncSubmit(checked: boolean) {
        fetcher.submit(
            {
                automaticSynchronization: checked,
            },
            {
                method: "PATCH",
                encType: "application/json",
                action: appRoutes.repo.detail.link(props.repositoryId),
            }
        );
    }

    function handleToggleAutomaticSyncChange(checked: boolean) {
        if (checked) {
            setIsOpen(true);
        } else {
            submitAutomaticSyncSubmit(checked);
        }
    }

    function handleAlertModalCloseOrCancel() {
        setIsOpen(false);
        reRender();
    }

    function handleAlertModalConfirm() {
        setIsOpen(false);
        submitAutomaticSyncSubmit(true);
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                }}
                className="toggle-switch-wrapper"
            >
                Sincronização automática
                <ToggleSwitch
                    aria-labelledby="Sincronização automática"
                    key={renderToggle ? 1 : 2}
                    defaultChecked={props.automaticSynchronization}
                    onChange={handleToggleAutomaticSyncChange}
                />
            </Box>

            <AlertModal
                onCancel={handleAlertModalCloseOrCancel}
                onClose={handleAlertModalCloseOrCancel}
                onConfirm={handleAlertModalConfirm}
                header="Ativar sincronização automática?"
                isOpen={isOpen}
            >
                Ao ativar a sincronização automática, o GitGrade irá sincronizar
                automaticamente o repositório com as informações do GitHub todos
                os dias. Ativar essa opção sem necessidade aumentará o tempo
                total de sincronização de todos os repositórios.
                <br />
                <br />
                <Box
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    Deseja ativar a sincronização automática?
                </Box>
            </AlertModal>
        </Box>
    );
}
