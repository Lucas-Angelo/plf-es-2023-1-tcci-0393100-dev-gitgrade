import React, { useEffect } from "react";
import { Box, ToggleSwitch } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { useToggle } from "../../../../../../../commom/hooks/useToggle";

interface IBranchAutomaticSyncToggleProps {
    children: React.ReactNode;
    ariaLabelledBy: string;
    defaultChecked: boolean;

    syncType: "file" | "commit";

    repositoryId: number;
    branchId: number;
}

export default function BranchAutomaticSyncToggle(
    props: IBranchAutomaticSyncToggleProps
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

    function handleBranchAutomaticSyncChange(checked: boolean) {
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
        </Box>
    );
}
