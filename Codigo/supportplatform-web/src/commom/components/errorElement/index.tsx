import { Flash, PageLayout } from "@primer/react";
import { useRouteError } from "react-router";

export default function ErrorElement() {
    const error = useRouteError() as Error;
    return (
        <PageLayout>
            <Flash
                variant="danger"
                sx={{ width: "100%" }}
            >
                {error.message}
            </Flash>
        </PageLayout>
    );
}
