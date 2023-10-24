import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { toast } from "react-toastify";
import { RepositoryService } from "../../../../../commom/service/api/repository";
import queryClient from "../../../../../commom/data/client";
import {
    getRepositoryByIdQuery,
    getRepositoryQuery,
} from "../../../../../commom/data/repo";

const pageUrlParams = appRoutes.evaluationMethod.detail.repo.detail.getParams();
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function EvaluationMethodRepositoryAction({
    params,
    request,
}: ActionFunctionArgs) {
    const { id: evaluationMethodIdParam, repoId: repoIdParam } =
        params as Params<PageUrlParam>;

    if (evaluationMethodIdParam === undefined) throw new Error("Invalid URL");

    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId))
        throw new Error("Invalid evaluation method id");

    if (repoIdParam === undefined) throw new Error("Invalid URL");

    const repoId = Number(repoIdParam);
    if (Number.isNaN(repoId)) throw new Error("Invalid repo id");

    if (request.method === "post" || request.method === "POST") {
        try {
            const patchReponse = await new RepositoryService().patch(repoId, {
                evaluationMethodId,
            });
            await queryClient.invalidateQueries(getRepositoryQuery().queryKey);
            queryClient.setQueryData(
                getRepositoryByIdQuery(repoId).queryKey,
                patchReponse.data
            );

            toast.success(
                "Repositório adicionado ao método avaliativo com sucesso!"
            );

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível atualizar o método avaliativo"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else if (request.method === "delete" || request.method === "DELETE") {
        try {
            const patchReponse = await new RepositoryService().patch(repoId, {
                evaluationMethodId: null,
            });
            await queryClient.invalidateQueries(getRepositoryQuery().queryKey);
            queryClient.setQueryData(
                getRepositoryByIdQuery(repoId).queryKey,
                patchReponse.data
            );

            toast.success(
                "Repositório removido do método avaliativo com sucesso!"
            );

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível atualizar o método avaliativo"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else {
        return null;
    }
}
