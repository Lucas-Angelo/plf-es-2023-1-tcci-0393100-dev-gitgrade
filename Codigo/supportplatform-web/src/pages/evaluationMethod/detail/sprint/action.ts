import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../commom/data/client";
import {
    getEvaluationMethodSprintByIdQuery,
    getEvaluationMethodSprintQuery,
} from "../../../../commom/data/sprint";
import { SprintService } from "../../../../commom/service/api/sprint";
import { AxiosError } from "axios";
import { ErrorResponseDTO, SprintCreateDTO } from "@gitgrade/dtos";
import { SprintValidator } from "../../../../commom/validation/SprintValidator";
import ErrorMapper from "../../../../commom/mapping/ErrorMapper";

const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function EvaluationMethodSprintAction({
    request,
    params,
}: ActionFunctionArgs) {
    const { id: evaluationMethodIdParam } = params as Params<PageUrlParam>;

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    if (request.method === "post" || request.method === "POST") {
        const formData = await request.formData();
        const name = formData.get("name");
        const start_date = formData.get("start_date");
        const end_date = formData.get("end_date");

        const errors = new SprintValidator().validate({
            name,
            start_date,
            end_date,
        });

        if (errors.length > 0) {
            return {
                error: errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            };
        }

        try {
            const createResponse = await new SprintService().create({
                start_date: new Date(start_date as string),
                end_date: new Date(end_date as string),
                name: String(name),
                evaluationMethodId,
            });
            queryClient.removeQueries(
                getEvaluationMethodSprintQuery(evaluationMethodId)
            );
            queryClient.setQueryData(
                getEvaluationMethodSprintByIdQuery(
                    evaluationMethodId,
                    createResponse.data.id
                ).queryKey,
                createResponse.data
            );

            toast.success("Sprint criada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<
                ErrorResponseDTO<`body.${keyof SprintCreateDTO}`>
            >;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else if (axiosResponse.response.status !== 422) {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível criar a sprint"
                );
            }

            let processedError:
                | ErrorResponseDTO<keyof SprintCreateDTO>
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
    } else {
        return null;
    }
}
