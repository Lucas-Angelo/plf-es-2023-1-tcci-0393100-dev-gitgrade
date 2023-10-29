import { useQuery } from "@tanstack/react-query";
import { getRepositoryByIdQuery } from "../repo";
import { CommitService } from "../../service/api/commits";
import { CommitSearchDTO } from "@gitgrade/dtos";

export const getRepositoryCommitQuery = (
    repositoryId: number,
    filterOptions?: Omit<CommitSearchDTO, "repositoryId">
) => {
    const baseKey = getRepositoryByIdQuery(repositoryId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "commit", filterOptions]
            : [...baseKey, "commit"],
        queryFn: async () =>
            new CommitService()
                .getAll({ ...filterOptions, repositoryId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useRepositoryCommitList = (
    repositoryId: number,
    filterOptions?: Omit<CommitSearchDTO, "repositoryId">
) => useQuery(getRepositoryCommitQuery(repositoryId, filterOptions));
