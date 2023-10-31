import { LoaderFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { loadQueryData } from "../../../../../commom/data/utils/load";
import { getBranchesByRepositoryIdQuery } from "../../../../../commom/data/branch";
import { BranchDTO, PaginationResponseDTO } from "@gitgrade/dtos";

const pageRouteSearchParams = appRoutes.repo.detail.params;
type PagePathParam = (typeof pageRouteSearchParams)[number];

export type RepositoryBranchesLoaderData = PaginationResponseDTO<BranchDTO>;

export default function repositoryBranchesConfigPageLoader({
    params,
}: LoaderFunctionArgs): Promise<RepositoryBranchesLoaderData> {
    const { id } = params as Params<PagePathParam>;
    if (id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    return loadQueryData(getBranchesByRepositoryIdQuery(repositoryId));
}
