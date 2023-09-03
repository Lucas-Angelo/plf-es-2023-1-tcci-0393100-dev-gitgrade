import { LoaderFunctionArgs } from "react-router";
import { loadQueryData } from "../../../../../commom/data/utils/load";
import { getCommitMetricsGroupedByContributorByRepositoryIdQuery } from "../../../../../commom/data/repo/metrics/commits";

export default function repositoryCommitMetricsPageLoader({
    params,
}: LoaderFunctionArgs) {
    if (params.id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(params.id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    return loadQueryData(
        getCommitMetricsGroupedByContributorByRepositoryIdQuery(repositoryId)
    );
}
