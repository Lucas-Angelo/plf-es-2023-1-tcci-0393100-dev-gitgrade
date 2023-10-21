import { useQuery } from "@tanstack/react-query";
import { ContributorService } from "../../service/api/contributor";

export function getContributorsByRepositoryIdQuery(id: number) {
    return {
        queryKey: ["contributors", id],
        queryFn: async () =>
            new ContributorService()
                .getByRepositoryId(id)
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
}

export const useContributorsByRepositoryId = (id: number) =>
    useQuery(getContributorsByRepositoryIdQuery(id));
