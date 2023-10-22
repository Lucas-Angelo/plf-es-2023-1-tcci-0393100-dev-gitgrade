import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { loadQueryData } from "../../../../../commom/data/utils/load";
import { getIssuesMetricsGroupedByContributorByRepositoryIdQuery } from "../../../../../commom/data/repo/metrics/issues";

const pageRouteSearchParams = appRoutes.repo["detail"].search;

export default function repositoryCommitMetricsPageLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;

    if (params.id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(params.id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    return loadQueryData(
        getIssuesMetricsGroupedByContributorByRepositoryIdQuery(repositoryId, {
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
        })
    );
}
