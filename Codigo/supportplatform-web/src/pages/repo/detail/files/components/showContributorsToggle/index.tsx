import { Box, ToggleSwitch } from "@primer/react";
import { memo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageSearchParams = appRoutes.repo.detail.files.search;

function ShowContributorsToggle() {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultChecked =
        searchParams.get(pageSearchParams.shouldGetContributors) === "true";

    const handleToggleShowContributorsChange = useCallback(
        (checked: boolean) => {
            setSearchParams((previousSearchParams) => {
                const newSearchParams = new URLSearchParams(
                    previousSearchParams
                );
                if (checked) {
                    newSearchParams.set(
                        pageSearchParams.shouldGetContributors,
                        "true"
                    );
                } else {
                    newSearchParams.delete(
                        pageSearchParams.shouldGetContributors
                    );
                }
                return newSearchParams;
            });
        },
        [setSearchParams]
    );

    return (
        <Box
            className="toggle-switch-wrapper"
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-end",
            }}
        >
            Mostrar contribuidores
            <ToggleSwitch
                aria-labelledby="toggleShowContributors"
                onChange={handleToggleShowContributorsChange}
                defaultChecked={defaultChecked}
            />
        </Box>
    );
}

export default memo(ShowContributorsToggle);
