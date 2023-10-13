import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../commom/routes/appRoutes";
import { getEvaluationMethodByIdQuery } from "../../../commom/data/evaluationMethod";
import { loadQueryData } from "../../../commom/data/utils/load";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];

export default async function EvaluationMethodDetailLoader({
    params,
}: LoaderFunctionArgs) {
    const evaluationMethodIdParam = params["id" as PagePathParam];

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const query = getEvaluationMethodByIdQuery(evaluationMethodId);

    return await loadQueryData(query);
}
