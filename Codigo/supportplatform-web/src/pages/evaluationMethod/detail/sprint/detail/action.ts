import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../../commom/data/client";
import {
    getEvaluationMethodSprintByIdQuery,
    getEvaluationMethodSprintQuery,
} from "../../../../../commom/data/sprint";
import { SprintService } from "../../../../../commom/service/api/sprint";
import { AxiosError } from "axios";
import { ErrorResponseDTO, SprintCreateDTO } from "@gitgrade/dtos";
import { SprintValidator } from "../../../../../commom/validation/SprintValidator";
import ErrorMapper from "../../../../../commom/mapping/ErrorMapper";

const pageUrlParams =
    appRoutes.evaluationMethod.detail.sprint.detail.getParams();
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function EvaluationMethodSprintDetailAction({
    request,
    params,
}: ActionFunctionArgs) {
    const { id: evaluationMethodIdParam, sprintId: sprintIdParam } =
        params as Params<PageUrlParam>;
    if (evaluationMethodIdParam === undefined || sprintIdParam === undefined)
        throw new Error("Invalid URL");
    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const sprintId = Number(sprintIdParam);
    if (Number.isNaN(sprintId)) throw new Error("Invalid sprint id");

    if (request.method === "put" || request.method === "PUT") {
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
            const updateResponse = await new SprintService().update(sprintId, {
                start_date: new Date(start_date as string),
                end_date: new Date(end_date as string),
                name: String(name),
                evaluationMethodId,
            });
            queryClient.removeQueries(
                getEvaluationMethodSprintQuery(evaluationMethodId)
            );
            queryClient.setQueryData(
                getEvaluationMethodSprintByIdQuery(evaluationMethodId, sprintId)
                    .queryKey,
                updateResponse.data
            );

            toast.success("Sprint editada com sucesso!");

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
                        "Não foi possível editar a sprint"
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
    } else if (request.method === "delete" || request.method === "DELETE") {
        try {
            await new SprintService().delete(sprintId);
            await queryClient.invalidateQueries(
                getEvaluationMethodSprintQuery(evaluationMethodId).queryKey
            );
            await queryClient.invalidateQueries(
                getEvaluationMethodSprintByIdQuery(evaluationMethodId, sprintId)
            );

            toast.success("Sprint deletada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível deletar a sprint"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else {
        return null;
    }
}
