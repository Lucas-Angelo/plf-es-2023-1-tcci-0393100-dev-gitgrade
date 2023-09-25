import { IssueMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";

export class IssueService {
    async getIssueMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number,
        query?: {
            startedAt?: string;
            endedAt?: string;
            contributors?: Array<string>;
        }
    ) {
        const searchParams = new URLSearchParams();
        if (query?.startedAt) searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt) searchParams.set("endedAt", query.endedAt);

        if (query?.contributors) {
            query.contributors.forEach((contributor) => {
                searchParams.append("contributor", contributor);
            });
        }

        return api.get<IssueMetricsDTO>(
            `repository/${repositoryId}/metric/issues?${searchParams.toString()}`
        );
    }
}
