import { useQuery } from "@tanstack/react-query";
import { RepositoryService } from "../../service/api/repository";
import { GetAllRepositoryQueryDTO } from "@gitgrade/dtos";

export const getRepositoryQuery = (
    filterOptions?: GetAllRepositoryQueryDTO
) => ({
    queryKey: filterOptions ? ["repo", filterOptions] : ["repo"],
    queryFn: async () =>
        new RepositoryService().getAll(filterOptions).then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useRepositoryList = (filterOptions?: GetAllRepositoryQueryDTO) =>
    useQuery(getRepositoryQuery(filterOptions));

export const getRepositoryByIdQuery = (id: number) => ({
    queryKey: ["repo", id],
    queryFn: async () =>
        new RepositoryService().getById(id).then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useRepositoryById = (id: number) =>
    useQuery(getRepositoryByIdQuery(id));
