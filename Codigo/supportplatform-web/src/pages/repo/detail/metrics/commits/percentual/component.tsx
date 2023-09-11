import { Box } from "@primer/react";
import PercentualCommitChart from "./components/percentualCommitChart";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useParams } from "react-router";
import { useCommitMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/commits";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryPercentualCommitMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: commitMetricsData } =
        useCommitMetricsGroupedByContributorByRepositoryId(id);

    return (
        <Box>
            {commitMetricsData && (
                <PercentualCommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
