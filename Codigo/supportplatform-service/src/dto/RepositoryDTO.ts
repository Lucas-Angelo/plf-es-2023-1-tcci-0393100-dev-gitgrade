export interface RepositoryDTO {
    id: number;
    evaluationMethod?: {
        id: number;
        name: string;
    };
    githubId: string;
    name: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    githubCreatedAt: Date;
    githubUpdatedAt: Date;
    hasProjectsEnabled: boolean;
    hasIssuesEnabled: boolean;
    primaryLanguage: string | null;
    licenseName: string | null;
    defaultBranch: string | null;
    automaticSynchronization: boolean;
    synchronizing: boolean;
    lastSyncAt: Date | null;
}