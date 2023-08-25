export interface FileChangeMetricsDTO {
    totalAdditions: number,
    totalDeletions: number,
    fileChangesPerContributor: Array<{
        contribuitor: {
            id: number,
            githubName: string,
            githubLogin: string,
            githubAvatarUrl: string,
        }
        addtions: {
            sum: number,
            percentage: number,
        }
        deletions: {
            sum: number,
            percentage: number,
        }
    }>
}