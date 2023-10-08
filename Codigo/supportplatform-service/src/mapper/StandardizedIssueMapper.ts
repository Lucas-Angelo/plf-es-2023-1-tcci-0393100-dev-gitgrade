import { StandardizedIssueResponseDTO } from "@gitgrade/dtos";
import { StandardizedIssue } from "../model/StandardizedIssue";

export class StandardizedIssueMapper {
    toDto(model: StandardizedIssue): StandardizedIssueResponseDTO {
        return {
            id: model.id,
            evaluationMethodId: model.evaluationMethodId,
            title: model.title,
            description: model.description ?? null,
        };
    }
}
