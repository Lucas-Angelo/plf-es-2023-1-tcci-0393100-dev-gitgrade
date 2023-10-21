import { CommitResponseDTO } from "@gitgrade/dtos";
import { Commit } from "../model/Commit";
import { BranchMapper } from "./BranchMapper";
import ContributorMapper from "./ContributorMapper";

export class CommitMapper {
    toDto(model: Commit): CommitResponseDTO {
        return {
            id: model.id,
            branch: new BranchMapper().toDto(model.branch),
            committedDate: model.committedDate,
            contributor: model.contributor
                ? new ContributorMapper().toDto(model.contributor)
                : undefined,
            message: model.message,
            sha: model.sha,
        };
    }
}
