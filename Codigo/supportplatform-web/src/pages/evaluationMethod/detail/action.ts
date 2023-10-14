import { ErrorResponseDTO, EvaluationMethodUpdateDTO } from "@gitgrade/dtos";
import { ActionFunctionArgs } from "react-router";
import { EvaluationMethodService } from "../../../commom/service/api/evaluationMethod";
import appRoutes from "../../../commom/routes/appRoutes";
import queryClient from "../../../commom/data/client";
import {
    getEvaluationMethodByIdQuery,
    getEvaluationMethodQuery,
} from "../../../commom/data/evaluationMethod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { loadQueryData } from "../../../commom/data/utils/load";
import { EvaluationMethodValidator } from "../../../commom/validation/EvaluationMethodValidator";
import ErrorMapper from "../../../commom/mapping/ErrorMapper";

type PagePathParam = (typeof appRoutes.evaluationMethod.detail.params)[number];

export default async function EvaluationMethodDetailAction({
    request,
    params,
}: ActionFunctionArgs) {
    if (request.method === "put" || request.method === "PUT") {
        const evaluationMethodIdParam = params["id" as PagePathParam];

        if (evaluationMethodIdParam === undefined)
            throw new Error("Invalid URL");

        const evaluationMethodId = Number(evaluationMethodIdParam);
        if (Number.isNaN(evaluationMethodId))
            throw new Error("Invalid evaluation method id");

        const formData = await request.formData();
        const description = formData.get("description");
        const year = formData.get("year");
        const semester = formData.get("semester");

        const errors = new EvaluationMethodValidator().validate({
            description,
            year,
            semester,
        });

        if (errors.length > 0) {
            return {
                error: errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            };
        }

        const currentEvaluationMethod = await loadQueryData(
            getEvaluationMethodByIdQuery(evaluationMethodId)
        );
        const disabledAt = currentEvaluationMethod.disabledAt ?? null;

        try {
            const createRespose = await new EvaluationMethodService().update(
                evaluationMethodId,
                {
                    year: Number(year),
                    semester: Number(semester),
                    description: String(description),
                    disabledAt,
                }
            );
            const evaluationMethod = createRespose.data;
            queryClient.removeQueries(getEvaluationMethodQuery());
            queryClient.setQueryData(
                getEvaluationMethodByIdQuery(evaluationMethodId).queryKey,
                evaluationMethod
            );

            toast.success("Método avaliativo editado com sucesso!");
            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<
                ErrorResponseDTO<`body.${keyof EvaluationMethodUpdateDTO}`>
            >;

            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else if (axiosResponse.response?.status !== 422) {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível atualizar o método avaliativo"
                );
            }

            let processedError:
                | ErrorResponseDTO<keyof EvaluationMethodUpdateDTO>
                | undefined = undefined;
            if (axiosResponse.response?.data.error) {
                processedError = new ErrorMapper().map(
                    axiosResponse.response.data,
                    "body"
                );
            }

            return {
                ...axiosResponse.response?.data,
                ...processedError,
            };
        }
    } else return null;
}
