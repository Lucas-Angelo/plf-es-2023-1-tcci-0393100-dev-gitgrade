import { BranchDTO } from "@gitgrade/dtos";
import { Branch } from "../model/Branch";

export class BranchMapper {
    toDto(model: Branch): BranchDTO {
        return {
            id: model.id,
            name: model.name,
        };
    }
}
