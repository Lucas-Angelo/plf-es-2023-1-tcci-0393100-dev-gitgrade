import { ActionFunctionArgs, Params } from "react-router";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { toast } from "react-toastify";
import appRoutes from "../../../commom/routes/appRoutes";
import { RepositoryService } from "../../../commom/service/api/repository";
import {
    getRepositoryByIdQuery,
    getRepositoryQuery,
} from "../../../commom/data/repo";
import queryClient from "../../../commom/data/client";

const pageUrlParams = appRoutes.repo.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function RepositoryAction({
    params,
    request,
}: ActionFunctionArgs) {
    const { id: repoIdParam } = params as Params<PageUrlParam>;

    const repoId = Number(repoIdParam);
    if (Number.isNaN(repoId)) throw new Error("Invalid repo id");

    const requestJson = (await request.json()) as {
        automaticSynchronization?: boolean;
    };
    const automaticSynchronization = requestJson.automaticSynchronization;

    if (
        (request.method === "patch" || request.method === "PATCH") &&
        automaticSynchronization !== undefined &&
        typeof automaticSynchronization === "boolean"
    ) {
        try {
            const patchReponse = await new RepositoryService().patch(repoId, {
                automaticSynchronization,
            });
            await queryClient.invalidateQueries(getRepositoryQuery().queryKey);
            queryClient.setQueryData(
                getRepositoryByIdQuery(repoId).queryKey,
                patchReponse.data
            );

            toast.success("Repositório atualizado com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível atualizar o repositorio"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else {
        return null;
    }
}
