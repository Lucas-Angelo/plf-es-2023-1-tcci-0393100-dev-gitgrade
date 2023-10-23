import { LoaderFunctionArgs } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { getRepositoryFileQuery } from "../../../../commom/data/file";
import { getIfDateIsValid } from "../../../../commom/utils/date";
import { loadQueryData } from "../../../../commom/data/utils/load";
import { PaginationResponseDTO, FileResponseDTO } from "@gitgrade/dtos";
import { getRepositoryByIdQuery } from "../../../../commom/data/repo";

type PagePathParam = (typeof appRoutes.repo.detail.params)[number];
const pageSearchParams = {
    ...appRoutes.repo.detail.search,
    ...appRoutes.repo.detail.files.search,
};

export type RepositoryFileListLoaderData =
    PaginationResponseDTO<FileResponseDTO>;

export default async function RepositoryFilesLoader({
    params,
    request,
}: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const repositoryIdParam = params["id" as PagePathParam];

    if (repositoryIdParam === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(repositoryIdParam);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    const startedAt_param = searchParams.get(pageSearchParams.startedAt);
    const endedAt_param = searchParams.get(pageSearchParams.endedAt);

    let branch = searchParams.get(pageSearchParams.branch);
    if (!branch) {
        const repository = await loadQueryData(
            getRepositoryByIdQuery(repositoryId)
        );
        branch = repository.defaultBranch;
    }

    const query = getRepositoryFileQuery(repositoryId, {
        page: Number(searchParams.get(pageSearchParams.page)) || 1,
        limit: 5,
        startedAt:
            startedAt_param && getIfDateIsValid(new Date(startedAt_param))
                ? new Date(startedAt_param)
                : undefined,
        endedAt:
            endedAt_param && getIfDateIsValid(new Date(endedAt_param))
                ? new Date(endedAt_param)
                : undefined,
        branchName: branch ?? "main",
        filterWithNoContributor:
            searchParams.get(pageSearchParams.filterWithNoContributor) ===
            "true"
                ? true
                : undefined,
        contributor: searchParams
            .getAll(pageSearchParams.contributor)
            .filter((c) => c !== ""),

        path: searchParams.get(pageSearchParams.path) ?? undefined,
    });

    return loadQueryData(query);
}
