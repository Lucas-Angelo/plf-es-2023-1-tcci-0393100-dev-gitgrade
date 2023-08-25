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

export interface GetAllRepositoryQueryDTO {
    /**
     * @isInt page must be an integer
     * @minimum 1 page must be greater than or equal to 1
     */
    page?: number;
    /**
     * @isInt limit must be an integer
     * @minimum 1 limit must be greater than or equal to 1
     */
    limit?: number;
    filter?: string
}