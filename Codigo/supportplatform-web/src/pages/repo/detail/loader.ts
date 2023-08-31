import { LoaderFunctionArgs } from "react-router";
import { ContributorDTO, RepositoryDTO } from "@gitgrade/dtos";
import { getRepositoryByIdQuery } from "../../../commom/data/repo";
import { getContributorsByRepositoryIdQuery } from "../../../commom/data/contributor";
import { loadQueryData } from "../../../commom/data/utils/load";

export interface RepoPageLoaderData {
    repository: RepositoryDTO;
    contributors: ContributorDTO[];
}

export default async function repoPageLoader({ params }: LoaderFunctionArgs) {
    if (params.id === undefined) throw new Error("Invalid URL");

    const repositoryId = Number(params.id);
    if (Number.isNaN(repositoryId)) throw new Error("Invalid repository id");

    const [repository, contributors] = await Promise.all([
        loadQueryData(getRepositoryByIdQuery(repositoryId)),
        loadQueryData(getContributorsByRepositoryIdQuery(repositoryId)),
    ]);

    return {
        repository,
        contributors,
    };
}
