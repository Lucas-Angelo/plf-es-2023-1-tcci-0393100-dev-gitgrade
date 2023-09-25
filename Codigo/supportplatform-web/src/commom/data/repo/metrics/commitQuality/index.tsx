import { useQuery } from "@tanstack/react-query";
import { CommitService } from "../../../../service/api/commits";

export const getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
        contributors?: Array<string>;
    }
) => ({
    queryKey: params
        ? ["repo", id, "metrics", "commitQuality", params]
        : ["repo", id, "metrics", "commitQuality"],
    queryFn: async () =>
        new CommitService()
            .getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery(
                id,
                params
            )
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useCommitQualityMetricsGroupedByContributorByRepositoryId = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
        contributors?: Array<string>;
    }
) =>
    useQuery(
        getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery(
            id,
            params
        )
    );
