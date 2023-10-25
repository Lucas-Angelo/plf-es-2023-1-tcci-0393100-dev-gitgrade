import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../../commom/data/client";
import {
    getEvaluationMethodStandardizedIssueByIdQuery,
    getEvaluationMethodStandardizedIssueQuery,
} from "../../../../../commom/data/standardizedIssue";
import { StandardizedIssueService } from "../../../../../commom/service/api/standardizedIssue";
import { AxiosError } from "axios";
import { ErrorResponseDTO, StandardizedIssueCreateDTO } from "@gitgrade/dtos";
import { StandardizedIssueValidator } from "../../../../../commom/validation/StandardizedIssueValidator";
import ErrorMapper from "../../../../../commom/mapping/ErrorMapper";

const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];
const pageSearchParams =
    appRoutes.evaluationMethod.detail.standardizedIssue.detail.search;

export default async function EvaluationMethodStandardizedIssueDetailAction({
    request,
    params,
}: ActionFunctionArgs) {
    const { id: evaluationMethodIdParam } = params as Params<PageUrlParam>;

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    const searchParams = new URL(request.url).searchParams;
    const standardizedIssueIdQuery = Number(
        searchParams.get(pageSearchParams.id)
    );

    if (!standardizedIssueIdQuery) throw new Error("Invalid URL");

    const standardizedIssueId = Number(standardizedIssueIdQuery);
    if (Number.isNaN(standardizedIssueId))
        throw new Error("Invalid standardizedIssue id");

    if (request.method === "put" || request.method === "PUT") {
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
            const updateResponse = await new StandardizedIssueService().update(
                standardizedIssueId,
                {
                    title: String(title),
                    description: String(description),
                    evaluationMethodId,
                }
            );
            queryClient.removeQueries(
                getEvaluationMethodStandardizedIssueQuery(evaluationMethodId)
            );
            queryClient.setQueryData(
                getEvaluationMethodStandardizedIssueByIdQuery(
                    evaluationMethodId,
                    standardizedIssueId
                ).queryKey,
                updateResponse.data
            );

            toast.success("Issue padronizada editada com sucesso!");

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
                        "Não foi possível editar a issue padronizada"
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
