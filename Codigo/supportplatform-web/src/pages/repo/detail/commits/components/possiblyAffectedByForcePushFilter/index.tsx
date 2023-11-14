import { Box, ToggleSwitch } from "@primer/react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageSearchParams = appRoutes.repo.detail.commits.search;

export default function PossiblyAffectedByForcePushFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    function handleToggleSwitchChange(checked: boolean) {
        setSearchParams((previousSearchParams) => {
            if (checked)
                previousSearchParams.set(
                    pageSearchParams.possiblyAffectedByForcePush,
                    "true"
                );
            else
                previousSearchParams.delete(
                    pageSearchParams.possiblyAffectedByForcePush
                );
            return previousSearchParams;
        });
    }

    return (
        <Box
            className="toggle-switch-wrapper"
            sx={{
                fontSize: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <ToggleSwitch
                size="small"
                aria-labelledby="Filtrar possívelmente afetados por force push"
                defaultChecked={
                    searchParams.get(
                        pageSearchParams.possiblyAffectedByForcePush
                    ) === "true"
                }
                onChange={handleToggleSwitchChange}
            />
            Filtrar possívelmente afetados por force push
        </Box>
    );
}
