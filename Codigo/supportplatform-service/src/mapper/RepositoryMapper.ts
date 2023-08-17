import { Repository } from "@gitgrade/models";
import { RepositoryDTO } from "@gitgrade/dtos";

export class RepositoryMapper {
    toDto(model: Repository): RepositoryDTO {
        return {
            id: model.id,
            name: model.name,
            automaticSynchronization: model.automaticSynchronization,
            defaultBranch: model.defaultBranch,
            description: model.description,
            forkCount: model.forkCount,
            githubCreatedAt: model.githubCreatedAt,
            githubId: model.githubId,
            githubUpdatedAt: model.githubUpdatedAt,
            hasIssuesEnabled: model.hasIssuesEnabled,
            hasProjectsEnabled: model.hasProjectsEnabled,
            lastSyncAt: model.lastSyncAt,
            licenseName: model.licenseName,
            primaryLanguage: model.primaryLanguage,
            stargazerCount: model.stargazerCount,
            synchronizing: model.synchronizing,
            evaluationMethod: undefined
        }
    }
}