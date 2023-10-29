import { useQuery } from "@tanstack/react-query";
import { getRepositoryByIdQuery } from "../repo";
import { ConsistencyRuleDeliveryService } from "../../service/api/consistencyRuleDelivery";
import { ConsistencyRuleDeliverySearchDTO } from "@gitgrade/dtos";

export const getRepositoryConsistencyRuleDeliveryQuery = (
    repositoryId: number,
    filterOptions?: Omit<ConsistencyRuleDeliverySearchDTO, "repositoryId">
) => {
    const baseKey = getRepositoryByIdQuery(repositoryId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "commit", filterOptions]
            : [...baseKey, "commit"],
        queryFn: async () =>
            new ConsistencyRuleDeliveryService()
                .getAll({ ...filterOptions, repositoryId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useRepositoryConsistencyRuleDeliveryList = (
    repositoryId: number,
    filterOptions?: Omit<ConsistencyRuleDeliverySearchDTO, "repositoryId">
) =>
    useQuery(
        getRepositoryConsistencyRuleDeliveryQuery(repositoryId, filterOptions)
    );
