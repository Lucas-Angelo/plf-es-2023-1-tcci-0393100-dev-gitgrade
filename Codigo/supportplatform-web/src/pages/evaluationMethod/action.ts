import { ActionFunctionArgs, redirect } from "react-router";
import { EvaluationMethodService } from "../../commom/service/api/evaluationMethod";
import { ErrorResponseDTO, EvaluationMethodCreateDTO } from "@gitgrade/dtos";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import appRoutes from "../../commom/routes/appRoutes";
import queryClient from "../../commom/data/client";
import { getEvaluationMethodQuery } from "../../commom/data/evaluationMethod";

export default async function EvaluationMethodCreateAction({
    request,
}: ActionFunctionArgs) {
    const formData = await request.formData();
    const description = formData.get("description");
    const year = formData.get("year");
    const semester = formData.get("semester");

    const errors: Array<
        ErrorResponseDTO<keyof EvaluationMethodCreateDTO>["error"]
    > = [];

    if (!description) {
        errors.push({
            description: {
                message: "Campo obrigatório",
                value: description,
            },
        });
    } else if (description.length > 255) {
        errors.push({
            description: {
                message: "Máximo de 255 caracteres",
            },
        });
    }

    if (!year) {
        errors.push({
            year: {
                message: "Campo obrigatório",
            },
        });
    }

    if (!semester) {
        errors.push({
            semester: {
                message: "Campo obrigatório",
            },
        });
    } else if (semester !== "1" && semester !== "2") {
        errors.push({
            semester: {
                message: "Deve ser 1 ou 2",
            },
        });
    }

    if (errors.length > 0) {
        return {
            error: errors.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        };
    }

    try {
        const createRespose = await new EvaluationMethodService().create({
            year: Number(year),
            semester: Number(semester),
            description: String(description),
        });
        const evaluationMethod = createRespose.data;
        queryClient.removeQueries(getEvaluationMethodQuery());

        toast.success("Método avaliativo criado com sucesso!");
        return redirect(
            appRoutes.evaluationMethod.detail.link(evaluationMethod.id)
        );
    } catch (error) {
        const axiosResponse = error as AxiosError<
            ErrorResponseDTO<`body.${keyof EvaluationMethodCreateDTO}`>
        >;

        if (!axiosResponse.response) {
            toast.error("Não foi possível se conectar ao servidor...");
        } else if (axiosResponse.response?.status !== 422) {
            toast.error(
                axiosResponse.response?.data.message ??
                    "Não foi possível criar o método avaliativo"
            );
        }

        let processedError:
            | ErrorResponseDTO<keyof EvaluationMethodCreateDTO>
            | undefined = undefined;
        if (axiosResponse.response?.data.error) {
            processedError = Object.entries(
                axiosResponse.response.data.error
            ).reduce((acc, [key, value]) => {
                const newKey = key.replace("body.", "");
                return {
                    ...acc,
                    [newKey]: value,
                };
            }, {} as ErrorResponseDTO<keyof EvaluationMethodCreateDTO>);
        }

        return {
            ...axiosResponse.response?.data,
            error: processedError,
        };
    }
}
