import { Box } from "@primer/react";
import RepositoryMetricsAside from "./components/repositoryMetricsAside";
import { Outlet } from "react-router";

export default function RepositoryMetricsPage() {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 3,
                flexDirection: ["column", "column", "row"],
            }}
        >
            <RepositoryMetricsAside />
            <Outlet />
        </Box>
    );
}
