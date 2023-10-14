import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryPatchDTO,
    RepositoryResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class RepositoryService {
    getAll(queryDto?: GetAllRepositoryQueryDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.filter) searchParams.set("filter", queryDto.filter);
        if (queryDto?.evaluationMethodId !== undefined)
            searchParams.set(
                "evaluationMethodId",
                String(queryDto.evaluationMethodId)
            );

        return api.get<PaginationResponseDTO<RepositoryResponseDTO>>(
            "repository?".concat(searchParams.toString())
        );
    }

    patch(id: number, repository: Partial<RepositoryPatchDTO>) {
        return api.patch<RepositoryResponseDTO>(`repository/${id}`, repository);
    }

    getById(id: number) {
        return api.get<RepositoryResponseDTO>(`repository/${id}`);
    }
}
