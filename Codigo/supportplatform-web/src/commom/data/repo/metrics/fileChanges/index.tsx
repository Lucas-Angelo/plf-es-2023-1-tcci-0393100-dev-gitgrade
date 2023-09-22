import { useQuery } from "@tanstack/react-query";
import FileService from "../../../../service/api/file";

export const getFileChangesMetricsGroupedByContributorByRepositoryIdQuery = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
    }
) => ({
    queryKey: params
        ? ["repo", id, "metrics", "linesOfCode", params]
        : ["repo", id, "metrics", "linesOfCode"],
    queryFn: async () =>
        new FileService()
            .getFileChangesGroupedByContributorByRepositoryIdQuery(id, params)
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useFileChangesMetricsGroupedByContributorByRepositoryId = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
    }
) =>
    useQuery(
        getFileChangesMetricsGroupedByContributorByRepositoryIdQuery(id, params)
    );
