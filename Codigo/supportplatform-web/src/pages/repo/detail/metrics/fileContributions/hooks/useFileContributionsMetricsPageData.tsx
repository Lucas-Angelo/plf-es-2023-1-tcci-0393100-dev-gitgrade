import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useFileChangesMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/fileChanges";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export function useFileContributionsMetricsPageData() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: linesOfCodeMetricsData } =
        useFileChangesMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
            contributors:
                searchParams.getAll(pageRouteSearchParams.contributor) ??
                undefined,
        });

    return linesOfCodeMetricsData;
}
