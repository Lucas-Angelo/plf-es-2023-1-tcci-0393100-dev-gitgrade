import { CommitMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";

export class CommitService {
    async getCommitMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number
    ) {
        return api.get<CommitMetricsDTO>(
            `repository/${repositoryId}/metric/commit`
        );
    }
}
