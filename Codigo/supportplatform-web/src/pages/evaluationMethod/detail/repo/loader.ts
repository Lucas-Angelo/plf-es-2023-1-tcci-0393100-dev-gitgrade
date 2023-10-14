import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { getRepositoryQuery } from "../../../../commom/data/repo";
import { loadQueryData } from "../../../../commom/data/utils/load";
import { PaginationResponseDTO, RepositoryResponseDTO } from "@gitgrade/dtos";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];
const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;

export type EvaluationMethodRepoListPageLoaderData =
    PaginationResponseDTO<RepositoryResponseDTO>;

export default function EvaluationMethodRepositoryListLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const evaluationMethodIdParam = params["id" as PagePathParam];

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const query = getRepositoryQuery({
        evaluationMethodId: evaluationMethodId,
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        filter: searchParams.get(pageSearchParams.filter) || undefined,
    });

    return loadQueryData(query);
}
