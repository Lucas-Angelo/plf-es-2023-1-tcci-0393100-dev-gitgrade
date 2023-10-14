import { useQuery } from "@tanstack/react-query";
import { CommitService } from "../../../../service/api/commits";

export const getCommitMetricsGroupedByContributorByRepositoryIdQuery = (
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
        ? ["repo", id, "metrics", "commits", params]
        : ["repo", id, "metrics", "commits"],
    queryFn: async () =>
        new CommitService()
            .getCommitMetricsGroupedByContributorByRepositoryIdQuery(id, params)
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useCommitMetricsGroupedByContributorByRepositoryId = (
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
        getCommitMetricsGroupedByContributorByRepositoryIdQuery(id, params)
    );
