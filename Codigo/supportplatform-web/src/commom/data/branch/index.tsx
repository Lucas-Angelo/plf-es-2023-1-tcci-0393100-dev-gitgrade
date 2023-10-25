import { useQuery } from "@tanstack/react-query";
import { BranchService } from "../../service/api/branch";
import { getRepositoryByIdQuery } from "../repo";

export function getBranchesByRepositoryIdQuery(id: number) {
    return {
        queryKey: [...getRepositoryByIdQuery(id).queryKey, "branch"],
        queryFn: async () =>
            new BranchService().getByRepositoryId(id).then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
}

export const useBranchesByRepositoryId = (id: number) =>
    useQuery(getBranchesByRepositoryIdQuery(id));
