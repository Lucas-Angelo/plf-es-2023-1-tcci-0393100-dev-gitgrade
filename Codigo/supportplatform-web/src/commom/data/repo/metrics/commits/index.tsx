import { useQuery } from "@tanstack/react-query";
import { CommitService } from "../../../../service/api/commits";

export const getCommitMetricsGroupedByContributorByRepositoryIdQuery = (
    id: number
) => ({
    queryKey: ["repo", id, "metrics", "commits"],
    queryFn: async () =>
        new CommitService()
            .getCommitMetricsGroupedByContributorByRepositoryIdQuery(id)
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useCommitMetricsGroupedByContributorByRepositoryId = (
    id: number
) => useQuery(getCommitMetricsGroupedByContributorByRepositoryIdQuery(id));
