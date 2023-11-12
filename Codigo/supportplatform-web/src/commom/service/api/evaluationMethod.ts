import {
    EvaluationMethodSearchDTO,
    PaginationResponseDTO,
    EvaluationMethodResponseDTO,
    EvaluationMethodCreateDTO,
    EvaluationMethodUpdateDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class EvaluationMethodService {
    async getAll(queryDto?: EvaluationMethodSearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.description)
            searchParams.set("description", queryDto.description);
        if (queryDto?.year) searchParams.set("year", queryDto.year.toString());
        if (queryDto?.semester)
            searchParams.set("semester", queryDto.semester.toString());

        return api.get<PaginationResponseDTO<EvaluationMethodResponseDTO>>(
            "evaluation-method?".concat(searchParams.toString())
        );
    }

    async getById(id: number) {
        return api.get<EvaluationMethodResponseDTO>(`evaluation-method/${id}`);
    }

    async create(evaluationMethod: EvaluationMethodCreateDTO) {
        return api.post<EvaluationMethodResponseDTO>(
            "evaluation-method",
            evaluationMethod
        );
    }

    async update(id: number, evaluationMethod: EvaluationMethodUpdateDTO) {
        return api.put<EvaluationMethodResponseDTO>(
            `evaluation-method/${id}`,
            evaluationMethod
        );
    }

    async delete(id: number) {
        return api.delete(`evaluation-method/${id}`);
    }
}
