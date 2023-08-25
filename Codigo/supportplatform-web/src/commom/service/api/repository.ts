import {
    GetAllRepositoryQueryDTO,
    PaginationResponseDTO,
    RepositoryDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class RepositoryService {
    getAll(queryDto?: GetAllRepositoryQueryDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.filter) searchParams.set("filter", queryDto.filter);

        return api.get<PaginationResponseDTO<RepositoryDTO>>(
            "repository?".concat(searchParams.toString())
        );
    }
}
