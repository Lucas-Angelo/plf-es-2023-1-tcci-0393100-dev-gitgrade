import { CommitMetricsDTO, CommitQualityMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";

export class CommitService {
    async getCommitMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number,
        query?: {
            branchName?: string;
            startedAt?: string;
            endedAt?: string;
            contributors?: Array<string>;
            filterWithNoContributor?: boolean;
        }
    ) {
        const searchParams = new URLSearchParams();
        if (query?.branchName) searchParams.set("branchName", query.branchName);
        if (query?.startedAt) searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt) searchParams.set("endedAt", query.endedAt);
        if (query?.filterWithNoContributor)
            searchParams.set("filterWithNoContributor", "true");

        if (query?.contributors) {
            query.contributors.forEach((contributor) => {
                searchParams.append("contributor", contributor);
            });
        }

        return api.get<CommitMetricsDTO>(
            `repository/${repositoryId}/metric/commit?${searchParams.toString()}`
        );
    }

    async getCommitQualityMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number,
        query?: {
            branchName?: string;
            startedAt?: string;
            endedAt?: string;
            contributors?: Array<string>;
            filterWithNoContributor?: boolean;
        }
    ) {
        const searchParams = new URLSearchParams();
        if (query?.branchName) searchParams.set("branchName", query.branchName);
        if (query?.startedAt) searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt) searchParams.set("endedAt", query.endedAt);

        if (query?.contributors) {
            query.contributors.forEach((contributor) => {
                searchParams.append("contributor", contributor);
            });
        }

        if (query?.filterWithNoContributor)
            searchParams.set("filterWithNoContributor", "true");

        return api.get<CommitQualityMetricsDTO>(
            `repository/${repositoryId}/metric/commit-quality?${searchParams.toString()}`
        );
    }
}
