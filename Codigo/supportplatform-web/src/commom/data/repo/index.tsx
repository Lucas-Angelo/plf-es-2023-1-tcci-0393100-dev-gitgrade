import { useQuery } from "@tanstack/react-query";
import { RepositoryService } from "../../service/api/repository";
import { GetAllRepositoryQueryDTO } from "@gitgrade/dtos";

export const getRepoQuery = (filterOptions?: GetAllRepositoryQueryDTO) => ({
    queryKey: filterOptions ? ["repo", filterOptions] : ["repo"],
    queryFn: async () =>
        new RepositoryService().getAll(filterOptions).then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useRepoList = (filterOptions?: GetAllRepositoryQueryDTO) =>
    useQuery(getRepoQuery(filterOptions));

export const getRepoByIdQuery = (id: string) => ({
    queryKey: ["repo", id],
    queryFn: async () =>
        new RepositoryService().getById(id).then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useRepoById = (id: string) => useQuery(getRepoByIdQuery(id));
