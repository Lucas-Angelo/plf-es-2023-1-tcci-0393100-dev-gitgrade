import { ActionFunctionArgs } from "react-router";
import appRoutes from "../../../commom/routes/appRoutes";
import { SyncService } from "../../../commom/service/api/sync";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";
import { toast } from "react-toastify";
import queryClient from "../../../commom/data/client";
import {
    getRepositoryByIdQuery,
    getRepositoryQuery,
} from "../../../commom/data/repo";

const pageSearchParams = appRoutes.repo.sync.search;

export default async function RepositorySyncAction({
    request,
}: ActionFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const repositoryIdQuery = searchParams.getAll(
        pageSearchParams.repositoryId
    );

    if (repositoryIdQuery === undefined || repositoryIdQuery.length === 0)
        throw new Error(
            "Invalid URL - missing " + pageSearchParams.repositoryId
        );

    const repositoryIds = repositoryIdQuery.map((repositoryIdParam) =>
        Number(repositoryIdParam)
    );

    for (const repositoryId of repositoryIds) {
        if (Number.isNaN(repositoryId))
            throw new Error("Invalid repository id: " + repositoryId);
    }

    if (request.method === "patch" || request.method === "PATCH") {
        try {
            const patchResponse = await new SyncService().sync(repositoryIds);
            await queryClient.invalidateQueries(getRepositoryQuery().queryKey);

            for (const repository of patchResponse.data) {
                queryClient.setQueryData(
                    getRepositoryByIdQuery(Number(repository.id)).queryKey,
                    repository
                );
            }

            toast.success("Sincronização iniciada com sucesso!");
            return {
                success: true,
            };
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
