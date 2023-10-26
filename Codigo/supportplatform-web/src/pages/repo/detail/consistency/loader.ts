import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { loadQueryData } from "../../../../commom/data/utils/load";
import {
    PaginationResponseDTO,
    ConsistencyRuleDeliveryResponseDTO,
} from "@gitgrade/dtos";
import { getRepositoryConsistencyRuleDeliveryQuery } from "../../../../commom/data/consistencyRuleDelivery";
import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";
import { getRepositoryByIdQuery } from "../../../../commom/data/repo";

type PagePathParam = (typeof appRoutes.repo.detail.params)[number];
const pageSearchParams = appRoutes.repo.detail.consistency.search;

export type RepositoryConsistencyRuleDeliveryListLoaderData =
    PaginationResponseDTO<ConsistencyRuleDeliveryResponseDTO>;

export default async function repositoryConsitencyRuleDeliveryListPageLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const repositoryIdParam = params["id" as PagePathParam];

    if (repositoryIdParam === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(repositoryIdParam);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    const repository = await loadQueryData(
        getRepositoryByIdQuery(repositoryId)
    );

    // get if status param belongs to the enum
    const statusParam = searchParams.get(pageSearchParams.status);
    let status: ConsistencyRuleDeliveryStatus | undefined;
    if (
        statusParam &&
        Object.values(ConsistencyRuleDeliveryStatus).includes(
            statusParam as ConsistencyRuleDeliveryStatus
        )
    ) {
        status = statusParam as ConsistencyRuleDeliveryStatus;
    }

    if (!repository.evaluationMethod) {
        throw new Error(
            "Tela não disponível para repositórios sem método avaliativo vinculado."
        );
    }

    const query = getRepositoryConsistencyRuleDeliveryQuery(repositoryId, {
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 35,
        consistencyRuleId:
            Number(searchParams.get(pageSearchParams.consistencyRuleId)) ||
            undefined,
        status,
        evaluationMethodId: repository.evaluationMethod.id,
    });

    return loadQueryData(query);
}
