import { ActionFunctionArgs, Params, redirect } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { EvaluationMethodService } from "../../../../commom/service/api/evaluationMethod";
import queryClient from "../../../../commom/data/client";
import {
    getEvaluationMethodByIdQuery,
    getEvaluationMethodQuery,
} from "../../../../commom/data/evaluationMethod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";

const pageUrlParams = appRoutes.evaluationMethod.detail.clone.getParams();
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function CloneEvaluationMethodAction({
    params,
    request,
}: ActionFunctionArgs) {
    const { id: evaluationMethodIdParam } = params as Params<PageUrlParam>;

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    if (request.method === "post" || request.method === "POST") {
        try {
            const postResponse = await new EvaluationMethodService().clone(
                evaluationMethodId
            );
            const duplicatedEvaluationMethodId = postResponse.data.id;
            await queryClient.invalidateQueries(
                getEvaluationMethodQuery().queryKey
            );
            queryClient.setQueryData(
                getEvaluationMethodByIdQuery(duplicatedEvaluationMethodId)
                    .queryKey,
                postResponse.data
            );

            toast.success("Método avaliativo duplicado com sucesso!");

            return redirect(
                appRoutes.evaluationMethod.detail.link(
                    duplicatedEvaluationMethodId
                )
            );
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível duplicar o método avaliativo"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    }
}
