export interface CommitMetricsDTO {
    contribuitor: {
        id: number,
        githubName: string,
        githubLogin: string,
        githubAvatarUrl: string,
    }
    commitCount: number
    commtiPercentage: number
}