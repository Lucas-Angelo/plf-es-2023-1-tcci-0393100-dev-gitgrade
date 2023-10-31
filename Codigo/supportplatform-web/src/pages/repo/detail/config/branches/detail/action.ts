import { ActionFunctionArgs, Params } from "react-router";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { BranchService } from "../../../../../../commom/service/api/branch";
import queryClient from "../../../../../../commom/data/client";
import { getBranchesByRepositoryIdQuery } from "../../../../../../commom/data/branch";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponseDTO } from "@gitgrade/dtos";

const pageUrlParams = appRoutes.repo.detail.config.branches.detail.getParams();
type PageUrlParam = (typeof pageUrlParams)[number];

export default async function RepositoryBranchesConfigPatchAction({
    params,
    request,
}: ActionFunctionArgs) {
    const { id: repoIdParam, branchId: branchIdParam } =
        params as Params<PageUrlParam>;

    const repoId = Number(repoIdParam);
    if (Number.isNaN(repoId)) throw new Error("Invalid repo id");

    const branchId = Number(branchIdParam);
    if (Number.isNaN(branchId)) throw new Error("Invalid branch id");

    const requestJson = (await request.json()) as {
        commitAutomaticSynchronization?: boolean;
        fileAutomaticSynchronization?: boolean;
    };
    const commitAutomaticSynchronization =
        requestJson.commitAutomaticSynchronization;
    const fileAutomaticSynchronization =
        requestJson.fileAutomaticSynchronization;

    if (
        (request.method === "patch" || request.method === "PATCH") &&
        ((commitAutomaticSynchronization !== undefined &&
            typeof commitAutomaticSynchronization === "boolean") ||
            (fileAutomaticSynchronization !== undefined &&
                typeof fileAutomaticSynchronization === "boolean"))
    ) {
        try {
            await new BranchService().patch(repoId, branchId, {
                commitAutomaticSynchronization,
                fileAutomaticSynchronization,
            });
            await queryClient.invalidateQueries(
                getBranchesByRepositoryIdQuery(repoId).queryKey
            );

            toast.success("Configuração de branch atualizada com sucesso!");

            return { success: true };
        } catch (error) {
            const axiosResponse = error as AxiosError<ErrorResponseDTO>;
            if (!axiosResponse.response) {
                toast.error("Não foi possível se conectar ao servidor...");
            } else {
                toast.error(
                    axiosResponse.response?.data.message ??
                        "Não foi possível atualizar a configuração da branch"
                );
            }

            return { error: axiosResponse.response?.data.message };
        }
    } else {
        return null;
    }
}
