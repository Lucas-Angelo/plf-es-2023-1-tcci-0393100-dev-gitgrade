import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useLinesOfCodeMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/linesOfCode";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export function useLinesOfCodeMetricsPageData() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: linesOfCodeMetricsData } =
        useLinesOfCodeMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
        });

    return linesOfCodeMetricsData;
}
