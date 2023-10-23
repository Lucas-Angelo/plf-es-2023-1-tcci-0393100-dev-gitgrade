import {
    FileChangeMetricsDTO,
    FileResponseDTO,
    FileSearchDTO,
    FileTypeMetricsDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";
import { getIfDateIsValid, getIfDateRangeIsValid } from "../../utils/date";

export class FileService {
    async getFileChangesGroupedByContributorByRepositoryIdQuery(
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

        return api.get<FileChangeMetricsDTO>(
            `repository/${repositoryId}/metric/changes?${searchParams.toString()}`
        );
    }

    async getFileTypeMetricsGroupedByContributorByRepositoryIdQuery(
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

        return api.get<FileTypeMetricsDTO>(
            `repository/${repositoryId}/metric/file-types?${searchParams.toString()}`
        );
    }

    async getAll(query?: FileSearchDTO) {
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

        if (query?.path) {
            searchParams.set("path", query.path);
        }
        if (query?.repositoryId) {
            searchParams.set("repositoryId", query.repositoryId.toString());
        }
        if (query?.page) searchParams.set("page", query.page.toString());
        if (query?.limit) searchParams.set("limit", query.limit.toString());

        return api.get<PaginationResponseDTO<FileResponseDTO>>(
            `/file?${searchParams.toString()}`
        );
    }
}
