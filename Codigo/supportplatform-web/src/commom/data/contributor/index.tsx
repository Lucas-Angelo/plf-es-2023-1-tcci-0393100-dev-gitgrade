import { useQuery } from "@tanstack/react-query";
import { ContributorService } from "../../service/api/contributor";
import { getRepositoryByIdQuery } from "../repo";

export function getContributorsByRepositoryIdQuery(id: number) {
    return {
        queryKey: [...getRepositoryByIdQuery(id).queryKey, "contributors"],
        queryFn: async () =>
            new ContributorService()
                .getByRepositoryId(id)
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
}

export const useContributorsByRepositoryId = (id: number) =>
    useQuery(getContributorsByRepositoryIdQuery(id));
