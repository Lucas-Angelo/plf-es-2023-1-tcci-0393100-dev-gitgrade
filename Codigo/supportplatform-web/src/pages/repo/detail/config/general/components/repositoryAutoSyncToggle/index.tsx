import { Box, ToggleSwitch } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { useToggle } from "../../../../../../../commom/hooks/useToggle";
import { useEffect } from "react";
import { ErrorResponseDTO } from "@gitgrade/dtos";

interface IRepositoryAutoSyncToggleProps {
    repositoryId: number;
    automaticSynchronization: boolean;
}

export default function RepositoryAutoSyncToggle(
    props: IRepositoryAutoSyncToggleProps
) {
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

    function handleToggleAutomaticSyncChange(checked: boolean) {
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
        </Box>
    );
}
