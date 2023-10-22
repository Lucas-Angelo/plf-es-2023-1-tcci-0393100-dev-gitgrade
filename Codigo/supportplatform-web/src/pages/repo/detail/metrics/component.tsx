import { Box } from "@primer/react";
import RepositoryMetricsAside from "./components/repositoryMetricsAside";
import { Outlet, useParams } from "react-router";
import Divider from "../../../../commom/components/divider";
import DateFilter from "../components/dateFilter";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useRepositoryById } from "../../../../commom/data/repo";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: repositoryData } = useRepositoryById(id);

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
                <DateFilter
                    repositoryGithubCreatedAt={repositoryData?.githubCreatedAt}
                    evaluationMethodId={repositoryData?.evaluationMethod?.id}
                />
                <Divider />
                <Outlet />
            </Box>
        </Box>
    );
}
