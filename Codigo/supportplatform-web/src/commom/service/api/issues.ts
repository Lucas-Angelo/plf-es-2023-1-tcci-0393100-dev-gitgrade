import { IssueMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";
import { getIfDateIsValid, getIfDateRangeIsValid } from "../../utils/date";

export class IssueService {
    async getIssueMetricsGroupedByContributorByRepositoryIdQuery(
        repositoryId: number,
        query?: {
            startedAt?: string;
            endedAt?: string;
            contributors?: Array<string>;
            filterWithNoContributor?: boolean;
        }
    ) {
        const searchParams = new URLSearchParams();
        const isStartedAtValid =
            query?.startedAt && getIfDateIsValid(new Date(query.startedAt));
        const isEndedAtValid =
            query?.endedAt && getIfDateIsValid(new Date(query.endedAt));
        const isDateRangeValid =
            !isStartedAtValid ||
            !isEndedAtValid ||
            getIfDateRangeIsValid(
                new Date(query.startedAt ?? ""),
                new Date(query.endedAt ?? "")
            );
        if (query?.startedAt && isStartedAtValid && isDateRangeValid)
            searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt && isEndedAtValid && isDateRangeValid)
            searchParams.set("endedAt", query.endedAt);

        if (query?.contributors) {
            query.contributors.forEach((contributor) => {
                searchParams.append("contributor", contributor);
            });
        }

        if (query?.filterWithNoContributor)
            searchParams.set("filterWithNoContributor", "true");

        return api.get<IssueMetricsDTO>(
            `repository/${repositoryId}/metric/issues?${searchParams.toString()}`
        );
    }
}
