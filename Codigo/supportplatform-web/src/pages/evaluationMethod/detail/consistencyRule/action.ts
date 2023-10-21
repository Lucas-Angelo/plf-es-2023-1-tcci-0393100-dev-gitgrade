import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../commom/data/client";
import {
    getEvaluationMethodConsistencyRuleByIdQuery,
    getEvaluationMethodConsistencyRuleQuery,
} from "../../../../commom/data/consistencyRule";
import { ConsistencyRuleService } from "../../../../commom/service/api/consistencyRule";
import { AxiosError } from "axios";
import { ErrorResponseDTO, ConsistencyRuleCreateDTO } from "@gitgrade/dtos";
import { ConsistencyRuleValidator } from "../../../../commom/validation/ConsistencyRuleValidator";
import ErrorMapper from "../../../../commom/mapping/ErrorMapper";
import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";

const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function EvaluationMethodConsistencyRuleAction({
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
        const description = formData.get("description");
        const filePath = formData.get("filePath");
        const sprintId = formData.get("sprintId");
        const standardizedIssueId = formData.get("standardizedIssueId");
        const validationType = formData.get("validationType");

        const errors = new ConsistencyRuleValidator().validate({
            description,
            filePath,
            sprintId,
            standardizedIssueId,
            validationType,
        });

        if (errors.length > 0) {
            return {
                error: errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            };
        }

        try {
            const createResponse = await new ConsistencyRuleService().create({
                description: description ? String(description) : null,
                filePath: String(filePath),
                sprintId: Number(sprintId),
                standardizedIssueId: standardizedIssueId
                    ? Number(standardizedIssueId)
                    : null,
                validationType: validationType as ValidationType,
                evaluationMethodId,
            });
            queryClient.removeQueries(
                getEvaluationMethodConsistencyRuleQuery(evaluationMethodId)
            );
            queryClient.setQueryData(
                getEvaluationMethodConsistencyRuleByIdQuery(
                    evaluationMethodId,
                    createResponse.data.id
                ).queryKey,
                createResponse.data
            );

            toast.success("Regra de consistência criada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<
                ErrorResponseDTO<`body.${keyof ConsistencyRuleCreateDTO}`>
            >;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else if (axiosResponse.response.status !== 422) {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível criar a regra de consistência"
                );
            }

            let processedError:
                | ErrorResponseDTO<keyof ConsistencyRuleCreateDTO>
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
