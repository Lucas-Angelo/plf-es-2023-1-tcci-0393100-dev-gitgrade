import { ContributorDTO } from "@gitgrade/dtos";
import { Contributor } from "../model/Contributor";

export default class ContributorMapper {
    toDto(model: Contributor): ContributorDTO {
        return {
            id: model.id,
            githubAvatarUrl: model.githubAvatarUrl,
            githubLogin: model.githubLogin,
            githubName: model.githubName,
            githubEmail: model.githubEmail,
        };
    }
}
