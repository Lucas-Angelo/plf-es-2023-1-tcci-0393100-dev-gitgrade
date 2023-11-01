import {
    CodeQualityResponseDTO,
    CodeQualitySearchDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class CodeQualityService {
    async getAll(repositoyId: number, queryDto?: CodeQualitySearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());

        if (queryDto?.status) searchParams.set("status", queryDto.status);

        return api.get<PaginationResponseDTO<CodeQualityResponseDTO>>(
            `code-quality/repository/${repositoyId}?`.concat(
                searchParams.toString()
            )
        );
    }

    async create(repositoyId: number) {
        return api.post<CodeQualityResponseDTO>(
            `code-quality/repository/${repositoyId}`
        );
    }
}
