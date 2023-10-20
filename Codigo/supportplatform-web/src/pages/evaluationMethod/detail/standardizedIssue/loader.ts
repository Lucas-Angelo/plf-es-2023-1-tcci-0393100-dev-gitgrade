import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { getEvaluationMethodStandardizedIssueQuery } from "../../../../commom/data/standardizedIssue";
import { loadQueryData } from "../../../../commom/data/utils/load";
import {
    PaginationResponseDTO,
    StandardizedIssueResponseDTO,
} from "@gitgrade/dtos";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];
const pageSearchParams =
    appRoutes.evaluationMethod.detail.standardizedIssue.search;

export type EvaluationMethodStandardizedIssueListLoaderData =
    PaginationResponseDTO<StandardizedIssueResponseDTO>;

export default function EvaluationMethodStandardizedIssueListLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const evaluationMethodIdParam = params["id" as PagePathParam];

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const query = getEvaluationMethodStandardizedIssueQuery(
        evaluationMethodId,
        {
            page: Number(searchParams.get(pageSearchParams.page)) || 1,
            limit: 10,
            title: searchParams.get(pageSearchParams.title) || undefined,
        }
    );

    return loadQueryData(query);
}
