import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { getEvaluationMethodConsistencyRuleQuery } from "../../../../commom/data/consistencyRule";
import { loadQueryData } from "../../../../commom/data/utils/load";
import {
    PaginationResponseDTO,
    ConsistencyRuleResponseDTO,
} from "@gitgrade/dtos";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];
const pageSearchParams =
    appRoutes.evaluationMethod.detail.consistencyRule.search;

export type EvaluationMethodConsistencyRuleListLoaderData =
    PaginationResponseDTO<ConsistencyRuleResponseDTO>;

export default function EvaluationMethodConsistencyRuleListLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const evaluationMethodIdParam = params["id" as PagePathParam];

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const query = getEvaluationMethodConsistencyRuleQuery(evaluationMethodId, {
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 10,
        description: searchParams.get(pageSearchParams.description) || "",
    });

    return loadQueryData(query);
}
