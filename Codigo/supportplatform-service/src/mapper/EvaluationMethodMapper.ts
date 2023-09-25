import { EvaluationMethodResponseDTO } from "@gitgrade/dtos";
import { EvaluationMethod } from "../model/EvaluationMethod";

export class EvaluationMethodMapper {
    toDto(model: EvaluationMethod): EvaluationMethodResponseDTO {
        return {
            id: model.id,
            description: model.description,
            semester: model.semester,
            year: model.year,
            disabledAt: model.disabledAt,
        };
    }
}
