import { Box } from "@primer/react";
import PercentualCommitChart from "./components/percentualCommitChart";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useParams } from "react-router";
import { useCommitMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/commits";
import { useSearchParams } from "react-router-dom";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export default function RepositoryPercentualCommitMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: commitMetricsData } =
        useCommitMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
        });

    return (
        <Box>
            {commitMetricsData && (
                <PercentualCommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
