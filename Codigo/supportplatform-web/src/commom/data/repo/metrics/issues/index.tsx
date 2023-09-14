import { useQuery } from "@tanstack/react-query";
import { IssueService } from "../../../../service/api/issues";

export const getIssuesMetricsGroupedByContributorByRepositoryIdQuery = (
    id: number,
    params?: {
        startedAt?: string;
        endedAt?: string;
    }
) => ({
    queryKey: params
        ? ["repo", id, "metrics", "issues", params]
        : ["repo", id, "metrics", "issues"],
    queryFn: async () =>
        new IssueService()
            .getIssueMetricsGroupedByContributorByRepositoryIdQuery(id, params)
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useIssuesMetricsGroupedByContributorByRepositoryId = (
    id: number,
    params?: {
        branchName?: string;
        startedAt?: string;
        endedAt?: string;
    }
) =>
    useQuery(
        getIssuesMetricsGroupedByContributorByRepositoryIdQuery(id, params)
    );
