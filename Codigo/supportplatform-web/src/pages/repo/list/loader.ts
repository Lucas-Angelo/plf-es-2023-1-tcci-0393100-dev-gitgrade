import { LoaderFunctionArgs } from "react-router";
import { getRepositoryQuery } from "../../../commom/data/repo";
import appRoutes from "../../../commom/routes/appRoutes";
import { PaginationResponseDTO, RepositoryDTO } from "@gitgrade/dtos";
import { loadQueryData } from "../../../commom/data/utils/load";

const pageSearchParams = appRoutes.repo.list.search;

export type RepoListPageLoaderData = PaginationResponseDTO<RepositoryDTO>;

export default async function repoListPageLoader({
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const query = getRepositoryQuery({
        filter: searchParams.get(pageSearchParams.filter) ?? undefined,
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 10,
    });

    return await loadQueryData(query);
}
