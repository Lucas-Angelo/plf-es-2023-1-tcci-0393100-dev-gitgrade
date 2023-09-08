import { SprintResponseDTO } from "@gitgrade/dtos";
import { Sprint } from "../model/Sprint";

export class SprintMapper {
    toDto(model: Sprint): SprintResponseDTO {
        return {
            id: model.id,
            start_date: model.start_date,
            end_date: model.end_date,
            evaluation_method_id: model.evaluation_method_id,
        };
    }
}
