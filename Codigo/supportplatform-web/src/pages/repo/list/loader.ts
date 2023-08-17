import { LoaderFunctionArgs } from "react-router";
import { getRepoQuery } from "../../../commom/data/repo";
import appRoutes from "../../../commom/routes/appRoutes";
import queryClient from "../../../commom/data/client";
import { IGetAllRepoResponse } from "../../../commom/models/repo";

const pageSearchParams = appRoutes.repo.list.search;

export default async function repoListPageLoader({
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const query = getRepoQuery({
        filter: searchParams.get(pageSearchParams.filter),
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
    });
    const queryState = queryClient.getQueryState<IGetAllRepoResponse>(
        query.queryKey
    );
    if (!queryState?.data || !queryState?.isInvalidated) {
        return await queryClient.fetchQuery(query);
    } else return queryState.data;
}
