import { useParams, useSearchParams } from "react-router-dom";
import { useIssuesMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/issues";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export function usePageIssueMetricsData() {
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

    return issueMetricsData;
}
