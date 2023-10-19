import {
    PaginationResponseDTO,
    ConsistencyRuleCreateDTO,
    ConsistencyRuleResponseDTO,
    ConsistencyRuleSearchDTO,
    ConsistencyRuleUpdateDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class ConsistencyRuleService {
    async getAll(queryDto?: ConsistencyRuleSearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.description)
            searchParams.set("description", queryDto.description);
        if (queryDto?.evaluationMethodId)
            searchParams.set(
                "evaluationMethodId",
                queryDto.evaluationMethodId.toString()
            );
        if (queryDto?.filePath) searchParams.set("filePath", queryDto.filePath);
        if (queryDto?.sprintId)
            searchParams.set("sprintId", queryDto.sprintId.toString());
        if (queryDto?.standardizedIssueId)
            searchParams.set(
                "standardizedIssueId",
                queryDto.standardizedIssueId.toString()
            );
        if (queryDto?.validationType)
            searchParams.set(
                "validationType",
                queryDto.validationType.toString()
            );

        return api.get<PaginationResponseDTO<ConsistencyRuleResponseDTO>>(
            "consistency-rule?".concat(searchParams.toString())
        );
    }
    async create(consistencyRule: ConsistencyRuleCreateDTO) {
        return api.post<ConsistencyRuleResponseDTO>(
            "consistency-rule",
            consistencyRule
        );
    }
    async update(id: number, consistencyRule: ConsistencyRuleUpdateDTO) {
        return api.put<ConsistencyRuleResponseDTO>(
            `consistency-rule/${id}`,
            consistencyRule
        );
    }
    async delete(id: number) {
        return api.delete(`consistency-rule/${id}`);
    }
    async getById(id: number) {
        return api.get<ConsistencyRuleResponseDTO>(`consistency-rule/${id}`);
    }
}
