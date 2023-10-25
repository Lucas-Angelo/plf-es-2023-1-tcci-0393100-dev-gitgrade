import { Box } from "@primer/react";
import RepositoryConfigAside from "./components/repositoryConfigAside";
import { Outlet } from "react-router";

export default function RepositoryConfigPage() {
    return (
        <Box
            sx={{
                display: ["block", "block", "block", "table"],
                tableLayout: "fixed",
                width: "100%",
            }}
        >
            <RepositoryConfigAside />
            <Box display={["block", "block", "block", "table-cell"]}>
                <Outlet />
            </Box>
        </Box>
    );
}
