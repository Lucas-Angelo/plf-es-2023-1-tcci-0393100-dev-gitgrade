import { Button } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../routes/appRoutes";

interface ISyncRepositoryButtonProps {
    repositoryId: number;
    synchronizing: boolean;

    variant?: "primary" | "default";
}

export default function SyncRepositoryButton(
    props: ISyncRepositoryButtonProps
) {
    const fetcher = useFetcher();
    const submitUrl = `${appRoutes.repo.sync.link()}?${
        appRoutes.repo.sync.search.repositoryId
    }=${props.repositoryId}`;

    const isSynchronizing =
        fetcher.state === "submitting" || props.synchronizing;

    return (
        <fetcher.Form
            method="PATCH"
            action={submitUrl}
        >
            <Button
                variant={props.variant ?? "primary"}
                disabled={isSynchronizing}
                type="submit"
            >
                {isSynchronizing ? "Sincronizando..." : "Sincronizar"}
            </Button>
        </fetcher.Form>
    );
}
