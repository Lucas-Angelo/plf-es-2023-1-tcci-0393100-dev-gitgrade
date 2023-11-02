import { CodeQualityResponseDTO } from "@gitgrade/dtos";
import { CodeQualityStatus } from "@gitgrade/dtos/dto/codeQuality";
import appRoutes from "../../../../commom/routes/appRoutes";
import { LoaderFunctionArgs } from "react-router";
import { loadQueryData } from "../../../../commom/data/utils/load";
import { getRepositoryCodeQualityQuery } from "../../../../commom/data/codeQuality";

type PagePathParam = (typeof appRoutes.repo.detail.params)[number];
const pageSearchParams = appRoutes.repo.detail.quality.search;

export type RepositoryCodeQualityListLoaderData = Array<CodeQualityResponseDTO>;

export default async function repositoryCodeQualityPageLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const repositoryIdParam = params["id" as PagePathParam];

    if (repositoryIdParam === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(repositoryIdParam);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    const query = getRepositoryCodeQualityQuery(repositoryId, {
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        status: searchParams.get(pageSearchParams.status) as
            | CodeQualityStatus
            | undefined,
    });

    return loadQueryData(query);
}
