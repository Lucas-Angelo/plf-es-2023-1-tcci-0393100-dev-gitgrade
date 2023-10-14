import { useParams } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useEvaluationMethodById } from "../../../../commom/data/evaluationMethod";

const pageRouteParams = appRoutes.evaluationMethod.detail.params;
type PageRouteParams = (typeof pageRouteParams)[number];

export function useEvaluationMethodPageData() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    return useEvaluationMethodById(id)?.data;
}
