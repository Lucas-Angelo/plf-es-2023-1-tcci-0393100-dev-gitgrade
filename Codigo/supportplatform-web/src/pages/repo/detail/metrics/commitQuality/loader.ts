import { LoaderFunctionArgs } from "react-router";
import { loadQueryData } from "../../../../../commom/data/utils/load";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery } from "../../../../../commom/data/repo/metrics/commitQuality";

const pageRouteSearchParams = appRoutes.repo["detail"].metrics.search;

export default function repositoryCommitQualityMetricsPageLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;

    if (params.id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(params.id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    return loadQueryData(
        getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery(
            repositoryId,
            {
                branchName:
                    searchParams.get(pageRouteSearchParams.branch) ?? undefined,
                endedAt:
                    searchParams.get(pageRouteSearchParams.endedAt) ??
                    undefined,
                startedAt:
                    searchParams.get(pageRouteSearchParams.startedAt) ??
                    undefined,
                contributors:
                    searchParams.getAll(pageRouteSearchParams.contributor) ??
                    undefined,
                filterWithNoContributor:
                    searchParams.get(
                        pageRouteSearchParams.filterWithNoContributor
                    ) === "true"
                        ? true
                        : false,
            }
        )
    );
}
