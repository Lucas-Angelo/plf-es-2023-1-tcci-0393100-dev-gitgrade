import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../commom/data/client";
import {
    getEvaluationMethodStandardizedIssueByIdQuery,
    getEvaluationMethodStandardizedIssueQuery,
} from "../../../../commom/data/standardizedIssue";
import { StandardizedIssueService } from "../../../../commom/service/api/standardizedIssue";
import { AxiosError } from "axios";
import { ErrorResponseDTO, StandardizedIssueCreateDTO } from "@gitgrade/dtos";
import { StandardizedIssueValidator } from "../../../../commom/validation/StandardizedIssueValidator";
import ErrorMapper from "../../../../commom/mapping/ErrorMapper";

const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function EvaluationMethodStandardizedIssueAction({
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
        const title = formData.get("title");
        const description = formData.get("description");

        const errors = new StandardizedIssueValidator().validate({
            title,
            description,
        });

        if (errors.length > 0) {
            return {
                error: errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            };
        }

        try {
            const createResponse = await new StandardizedIssueService().create({
                title: String(title),
                description: String(description),
                evaluationMethodId,
            });
            queryClient.removeQueries(
                getEvaluationMethodStandardizedIssueQuery(evaluationMethodId)
            );
            queryClient.setQueryData(
                getEvaluationMethodStandardizedIssueByIdQuery(
                    evaluationMethodId,
                    createResponse.data.id
                ).queryKey,
                createResponse.data
            );

            toast.success("Issue padronizada criada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<
                ErrorResponseDTO<`body.${keyof StandardizedIssueCreateDTO}`>
            >;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else if (axiosResponse.response.status !== 422) {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível criar a issue padronizada"
                );
            }

            let processedError:
                | ErrorResponseDTO<keyof StandardizedIssueCreateDTO>
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
