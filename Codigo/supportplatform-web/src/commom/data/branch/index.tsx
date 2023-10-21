import { useQuery } from "@tanstack/react-query";
import { BranchService } from "../../service/api/branch";

export function getBranchesByRepositoryIdQuery(id: number) {
    return {
        queryKey: ["repository", id, "branch"],
        queryFn: async () =>
            new BranchService().getByRepositoryId(id).then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
}

export const useBranchesByRepositoryId = (id: number) =>
    useQuery(getBranchesByRepositoryIdQuery(id));
