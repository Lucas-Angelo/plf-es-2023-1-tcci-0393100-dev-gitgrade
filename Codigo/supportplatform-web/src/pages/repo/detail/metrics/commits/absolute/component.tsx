import { useParams } from "react-router";
import { useCommitMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/commits";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import AbsoluteCommitChart from "./components/absoluteCommitChart";
import { Box } from "@primer/react";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryAbsoluteCommitMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: commitMetricsData } =
        useCommitMetricsGroupedByContributorByRepositoryId(id);

    return (
        <Box>
            {commitMetricsData && (
                <AbsoluteCommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
