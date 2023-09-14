import { useParams } from "react-router";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useIssuesMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/issues";
import { Box } from "@primer/react";
import { useSearchParams } from "react-router-dom";
import IssuesChart from "../components/issuesChart";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export default function RepositoryAuthorIssueMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: issueMetricsData } =
        useIssuesMetricsGroupedByContributorByRepositoryId(id, {
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
        });

    return (
        <Box>
            {issueMetricsData && (
                <IssuesChart
                    dataKey="authoredIssuesCount"
                    issueMetrics={issueMetricsData}
                />
            )}
        </Box>
    );
}
