import { LoaderFunctionArgs } from "react-router";
import { getEvaluationMethodQuery } from "../../../commom/data/evaluationMethod";
import appRoutes from "../../../commom/routes/appRoutes";
import {
    EvaluationMethodResponseDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { loadQueryData } from "../../../commom/data/utils/load";

const pageSearchParams = appRoutes.evaluationMethod.list.search;

export type EvaluationMethodListPageLoaderData =
    PaginationResponseDTO<EvaluationMethodResponseDTO>;

export default async function evaluationMethodListPageLoader({
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const query = getEvaluationMethodQuery({
        description: searchParams.get(pageSearchParams.filter) ?? undefined,
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 10,
    });

    return await loadQueryData(query);
}
