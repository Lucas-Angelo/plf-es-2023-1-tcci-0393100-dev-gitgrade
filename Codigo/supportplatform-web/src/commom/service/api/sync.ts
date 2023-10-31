import { RepositoryResponseDTO } from "@gitgrade/dtos";
import api from "../config/api";

export class SyncService {
    sync(repositoryIdList: number[]) {
        const searchParams = new URLSearchParams();
        repositoryIdList.forEach((repositoryId) => {
            searchParams.append("repositoryId", repositoryId.toString());
        });

        return api.patch<Array<RepositoryResponseDTO>>(
            `sync?${searchParams.toString()}`
        );
    }
}
