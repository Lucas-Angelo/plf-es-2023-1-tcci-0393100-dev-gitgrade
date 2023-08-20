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