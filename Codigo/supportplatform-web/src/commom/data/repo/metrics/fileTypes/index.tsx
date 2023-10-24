import { useQuery } from "@tanstack/react-query";
import { FileService } from "../../../../service/api/file";

export const getFileTypeMetricsGroupedByContributorByRepositoryIdQuery = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
        contributors?: Array<string>;
        filterWithNoContributor?: boolean;
    }
) => ({
    queryKey: params
        ? ["repo", id, "metrics", "fileType", params]
        : ["repo", id, "metrics", "fileType"],
    queryFn: async () =>
        new FileService()
            .getFileTypeMetricsGroupedByContributorByRepositoryIdQuery(
                id,
                params
            )
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useFileTypeMetricsGroupedByContributorByRepositoryId = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
        contributors?: Array<string>;
        filterWithNoContributor?: boolean;
    }
) =>
    useQuery(
        getFileTypeMetricsGroupedByContributorByRepositoryIdQuery(id, params)
    );
