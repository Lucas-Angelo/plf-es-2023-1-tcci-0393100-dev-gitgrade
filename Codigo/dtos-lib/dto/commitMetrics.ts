export interface CommitMetricsDTO {
    totalCommitCount: number,
    commitsPerContributor: Array<{
        contribuitor: {
            id: number,
            githubName: string,
            githubLogin: string,
            githubAvatarUrl: string,
        }
        commitCount: number
        commtiPercentage: number
    }>
}

export interface CommitMetricsQueryDTO {
    /** @isDate startedAt must be a valid date  */
    startedAt?: Date,
    /** @isDate endedAt must be a valid date */
    endedAt?: Date,
    branchName?: string,
}