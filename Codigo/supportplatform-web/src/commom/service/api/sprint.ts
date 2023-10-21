import {
    PaginationResponseDTO,
    SprintCreateDTO,
    SprintResponseDTO,
    SprintSearchDTO,
    SprintUpdateDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class SprintService {
    async getAll(queryDto?: SprintSearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.name) searchParams.set("name", queryDto.name);
        if (queryDto?.evaluationMethodId)
            searchParams.set(
                "evaluationMethodId",
                queryDto.evaluationMethodId.toString()
            );
        if (queryDto?.start_date)
            searchParams.set("start_date", queryDto.start_date.toISOString());
        if (queryDto?.end_date)
            searchParams.set("end_date", queryDto.end_date.toISOString());

        return api.get<PaginationResponseDTO<SprintResponseDTO>>(
            "sprint?".concat(searchParams.toString())
        );
    }
    async create(sprint: SprintCreateDTO) {
        return api.post<SprintResponseDTO>("sprint", {
            ...sprint,
            start_date: sprint.start_date.toISOString(),
            end_date: sprint.end_date.toISOString(),
        });
    }
    async update(id: number, sprint: SprintUpdateDTO) {
        return api.put<SprintResponseDTO>(`sprint/${id}`, {
            ...sprint,
            start_date: sprint.start_date.toISOString(),
            end_date: sprint.end_date.toISOString(),
        });
    }
    async delete(id: number) {
        return api.delete(`sprint/${id}`);
    }
    async getById(id: number) {
        return api.get<SprintResponseDTO>(`sprint/${id}`);
    }
}
