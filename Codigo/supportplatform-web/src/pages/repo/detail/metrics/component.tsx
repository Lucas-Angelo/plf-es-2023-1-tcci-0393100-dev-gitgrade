import { Box } from "@primer/react";
import RepositoryMetricsAside from "./components/repositoryMetricsAside";
import { Outlet } from "react-router";
import Divider from "../../../../commom/components/divider";
import DateFilter from "./components/dateFilter";

export default function RepositoryMetricsPage() {
    return (
        <Box
            sx={{
                display: ["block", "block", "block", "table"],
                tableLayout: "fixed",
                width: "100%",
            }}
        >
            <RepositoryMetricsAside />
            <Box display={["block", "block", "block", "table-cell"]}>
                <DateFilter />
                <Divider />
                <Outlet />
            </Box>
        </Box>
    );
}
