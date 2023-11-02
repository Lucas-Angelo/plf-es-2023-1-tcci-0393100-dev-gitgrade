import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { toast } from "react-toastify";
import queryClient from "../../../../commom/data/client";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { CodeQualityService } from "../../../../commom/service/api/codeQuality";
import { getRepositoryCodeQualityQuery } from "../../../../commom/data/codeQuality";

const pageUrlParams = appRoutes.repo.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function repositoryCodeQualityPageAction({
    request,
    params,
}: ActionFunctionArgs) {
    const { id: repositoryIdParam } = params as Params<PageUrlParam>;

    if (repositoryIdParam === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(repositoryIdParam);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    if (request.method === "post" || request.method === "POST") {
        try {
            await new CodeQualityService().create(repositoryId);
            await queryClient.invalidateQueries(
                getRepositoryCodeQualityQuery(repositoryId).queryKey
            );

            toast.success("Análise estática de código executada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else if (axiosResponse.response.status !== 422) {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível executar a análise de código..."
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else {
        return null;
    }
}
