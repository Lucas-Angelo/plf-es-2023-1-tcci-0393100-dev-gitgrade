import {
    CommitResponseDTO,
    CommitSearchDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import { getIfDateIsValid, getIfDateRangeIsValid } from "../../utils/date";
import api from "../config/api";

export class CommitService {
    async getAll(query?: CommitSearchDTO) {
        const searchParams = new URLSearchParams();
        if (query?.branchName) searchParams.set("branchName", query.branchName);

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
            searchParams.set("startedAt", query.startedAt.toISOString());
        if (query?.endedAt && isEndedAtValid && isDateRangeValid)
            searchParams.set("endedAt", query.endedAt.toISOString());
        if (query?.filterWithNoContributor)
            searchParams.set("filterWithNoContributor", "true");
        if (query?.contributor) {
            query.contributor.forEach((c) => {
                searchParams.append("contributor", c);
            });
        }
        if (query?.repositoryId) {
            searchParams.set("repositoryId", query.repositoryId.toString());
        }
        if (query?.page) searchParams.set("page", query.page.toString());
        if (query?.limit) searchParams.set("limit", query.limit.toString());

        return api.get<PaginationResponseDTO<CommitResponseDTO>>(
            `/commit?${searchParams.toString()}`
        );
    }
}
