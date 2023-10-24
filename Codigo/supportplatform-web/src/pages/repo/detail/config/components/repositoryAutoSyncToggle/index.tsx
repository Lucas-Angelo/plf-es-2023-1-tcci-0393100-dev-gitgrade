import { Box, ToggleSwitch } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IRepositoryAutoSyncToggleProps {
    repositoryId: number;
    automaticSynchronization: boolean;
}

export default function RepositoryAutoSyncToggle(
    props: IRepositoryAutoSyncToggleProps
) {
    const fetcher = useFetcher();

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
                    key={props.automaticSynchronization ? "on" : "off"}
                    defaultChecked={props.automaticSynchronization}
                    onChange={handleToggleAutomaticSyncChange}
                />
            </Box>
        </Box>
    );
}
