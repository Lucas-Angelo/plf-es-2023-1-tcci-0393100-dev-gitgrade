import {
    EvaluationMethodSearchDTO,
    PaginationResponseDTO,
    EvaluationMethodResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class EvaluationMethodService {
    getAll(queryDto?: EvaluationMethodSearchDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());
        if (queryDto?.description)
            searchParams.set("filter", queryDto.description);

        return api.get<PaginationResponseDTO<EvaluationMethodResponseDTO>>(
            "evaluation-method?".concat(searchParams.toString())
        );
    }
}
