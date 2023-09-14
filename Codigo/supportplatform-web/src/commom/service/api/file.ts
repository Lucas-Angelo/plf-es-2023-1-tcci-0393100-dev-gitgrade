import { FileChangeMetricsDTO, FileTypeMetricsDTO } from "@gitgrade/dtos";
import api from "../config/api";

export default class FileService {
    async getLinesOfCodeGroupedByContributorByRepositoryIdQuery(
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
        }
    ) {
        const searchParams = new URLSearchParams();
        if (query?.branchName) searchParams.set("branchName", query.branchName);
        if (query?.startedAt) searchParams.set("startedAt", query.startedAt);
        if (query?.endedAt) searchParams.set("endedAt", query.endedAt);

        return api.get<FileTypeMetricsDTO>(
            `repository/${repositoryId}/metric/fileTypes?${searchParams.toString()}`
        );
    }
}
