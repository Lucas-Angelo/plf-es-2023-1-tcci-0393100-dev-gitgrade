import { LoaderFunctionArgs } from "react-router";
import { ContributorDTO, RepositoryDTO } from "@gitgrade/dtos";
import { getBranchesByRepositoryIdQuery } from "../../../../commom/data/branch";
import { loadQueryData } from "../../../../commom/data/utils/load";

export interface RepoPageLoaderData {
    repository: RepositoryDTO;
    contributors: ContributorDTO[];
}

export default async function repositoryMetricsPageLoader({
    params,
}: LoaderFunctionArgs) {
    if (params.id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(params.id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    return await loadQueryData(getBranchesByRepositoryIdQuery(repositoryId));
}
