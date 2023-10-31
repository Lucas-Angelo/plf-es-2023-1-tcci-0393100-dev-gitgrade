import { LoaderFunctionArgs } from "react-router";
import {
    getRepositoryByIdQuery,
    getRepositoryQuery,
} from "../../../commom/data/repo";
import appRoutes from "../../../commom/routes/appRoutes";
import { PaginationResponseDTO, RepositoryResponseDTO } from "@gitgrade/dtos";
import { loadQueryData } from "../../../commom/data/utils/load";
import queryClient from "../../../commom/data/client";

const pageSearchParams = appRoutes.repo.list.search;

export type RepoListPageLoaderData =
    PaginationResponseDTO<RepositoryResponseDTO>;

export default async function repoListPageLoader({
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const query = getRepositoryQuery({
        filter: searchParams.get(pageSearchParams.filter) ?? undefined,
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 10,
    });

    const repositoryList = await loadQueryData(query);

    for (const repository of repositoryList.results) {
        queryClient.setQueryData(
            getRepositoryByIdQuery(Number(repository.id)).queryKey,
            repository
        );
    }

    return repositoryList;
}
