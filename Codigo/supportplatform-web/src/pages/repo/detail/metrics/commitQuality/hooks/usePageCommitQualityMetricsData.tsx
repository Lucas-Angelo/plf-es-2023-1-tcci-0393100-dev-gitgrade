import { useParams, useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useCommitQualityMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/commitQuality";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo["detail"].metrics.search;

export function usePageCommitQualityMetricsData() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: issueMetricsData } =
        useCommitQualityMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
            contributors:
                searchParams.getAll(pageRouteSearchParams.contributor) ??
                undefined,
            filterWithNoContributor:
                searchParams.get(
                    pageRouteSearchParams.filterWithNoContributor
                ) === "true"
                    ? true
                    : false,
        });

    return issueMetricsData;
}
