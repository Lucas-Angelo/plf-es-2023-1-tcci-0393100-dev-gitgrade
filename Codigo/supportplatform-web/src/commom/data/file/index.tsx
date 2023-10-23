import { useQuery } from "@tanstack/react-query";
import { getRepositoryByIdQuery } from "../repo";
import { FileService } from "../../service/api/file";
import { FileSearchDTO } from "@gitgrade/dtos";

export const getRepositoryFileQuery = (
    repositoryId: number,
    filterOptions?: Omit<FileSearchDTO, "repositoryId">
) => {
    const baseKey = getRepositoryByIdQuery(repositoryId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "file", filterOptions]
            : [...baseKey, "file"],
        queryFn: async () =>
            new FileService()
                .getAll({ ...filterOptions, repositoryId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useRepositoryFileList = (
    repositoryId: number,
    filterOptions?: Omit<FileSearchDTO, "repositoryId">
) => useQuery(getRepositoryFileQuery(repositoryId, filterOptions));
