import { ConsistencyRuleResponseDTO } from "@gitgrade/dtos";
import { ConsistencyRule } from "../model/ConsistencyRule";
import { ValidationTypeMapper } from "./ValidationTypeMapper";

export class ConsistencyRuleMapper {
    private validationTypeMapper: ValidationTypeMapper;

    constructor() {
        this.validationTypeMapper = new ValidationTypeMapper();
    }

    toDto = (model: ConsistencyRule): ConsistencyRuleResponseDTO => {
        return {
            id: model.id,
            evaluationMethodId: model.evaluationMethodId,
            sprintId: model.sprintId,
            standardizedIssueId: model.standardizedIssueId ?? null,
            description: model.description ?? null,
            filePath: model.filePath,
            validationType: this.validationTypeMapper.toDto(
                model.validationType
            ),
        };
    };
}
