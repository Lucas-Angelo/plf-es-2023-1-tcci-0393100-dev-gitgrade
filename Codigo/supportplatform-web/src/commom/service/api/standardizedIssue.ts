import {
    PaginationResponseDTO,
    StandardizedIssueCreateDTO,
    StandardizedIssueResponseDTO,
    StandardizedIssueSearchDTO,
    StandardizedIssueUpdateDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class StandardizedIssueService {
    async getAll(queryDto?: StandardizedIssueSearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.title) searchParams.set("title", queryDto.title);
        if (queryDto?.evaluationMethodId)
            searchParams.set(
                "evaluationMethodId",
                queryDto.evaluationMethodId.toString()
            );

        return api.get<PaginationResponseDTO<StandardizedIssueResponseDTO>>(
            "standardized-issue?".concat(searchParams.toString())
        );
    }
    async create(standardizedIssue: StandardizedIssueCreateDTO) {
        return api.post<StandardizedIssueResponseDTO>(
            "standardized-issue",
            standardizedIssue
        );
    }
    async update(id: number, standardizedIssue: StandardizedIssueUpdateDTO) {
        return api.put<StandardizedIssueResponseDTO>(
            `standardized-issue/${id}`,
            standardizedIssue
        );
    }
    async delete(id: number) {
        return api.delete(`standardized-issue/${id}`);
    }
    async getById(id: number) {
        return api.get<StandardizedIssueResponseDTO>(
            `standardized-issue/${id}`
        );
    }
}
