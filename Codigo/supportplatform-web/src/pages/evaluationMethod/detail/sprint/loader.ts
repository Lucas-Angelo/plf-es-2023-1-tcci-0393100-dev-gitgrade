import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { getEvaluationMethodSprintQuery } from "../../../../commom/data/sprint";
import { getIfDateIsValid } from "../../../../commom/utils/date";
import { loadQueryData } from "../../../../commom/data/utils/load";
import { PaginationResponseDTO, SprintResponseDTO } from "@gitgrade/dtos";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];
const pageSearchParams = appRoutes.evaluationMethod.detail.sprint.search;

export type EvaluationMethodSprintListLoaderData =
    PaginationResponseDTO<SprintResponseDTO>;

export default function EvaluationMethodSprintListLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const evaluationMethodIdParam = params["id" as PagePathParam];

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const start_date_param = searchParams.get(pageSearchParams.start_date);
    const end_date_param = searchParams.get(pageSearchParams.end_date);

    const query = getEvaluationMethodSprintQuery(evaluationMethodId, {
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 10,
        name: searchParams.get(pageSearchParams.name) || undefined,
        start_date:
            start_date_param && getIfDateIsValid(new Date(start_date_param))
                ? new Date(start_date_param)
                : undefined,
        end_date:
            end_date_param && getIfDateIsValid(new Date(end_date_param))
                ? new Date(end_date_param)
                : undefined,
    });

    return loadQueryData(query);
}
