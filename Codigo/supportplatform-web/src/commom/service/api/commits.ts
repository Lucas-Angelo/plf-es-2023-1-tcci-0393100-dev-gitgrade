import { CommitMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";

export class CommitService {
    async getCommitMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number,
        query?: {
            branchName?: string;
            startedAt?: string;
            endedAt?: string;
        }
    ) {
        const searchParams = new URLSearchParams();
        if (query?.branchName) searchParams.set("branchName", query.branchName);
        if (query?.startedAt) searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt) searchParams.set("endedAt", query.endedAt);

        return api.get<CommitMetricsDTO>(
            `repository/${repositoryId}/metric/commit?${searchParams.toString()}`
        );
    }
}
