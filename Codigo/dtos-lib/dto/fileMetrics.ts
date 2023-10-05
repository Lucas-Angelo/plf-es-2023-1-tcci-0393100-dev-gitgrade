export interface FileChangeMetricsDTO {
    totalAdditions: number,
    totalDeletions: number,
    fileCount: number,
    fileChangesPerContributor: Array<{
        contribuitor?: {
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
        },
        fileCount: number,
    }>
}

export interface FileTypeMetricDTO {
    count: number,
    extension: string,
}

export interface FileTypeMetricsDTO {
    general: Array<FileTypeMetricDTO>,
    perContributor: Array<{
        contributor: {
            id: number,
            githubName: string | null,
            githubLogin: string ,
            githubAvatarUrl: string | null,
        },
        fileTypes: Array<FileTypeMetricDTO>,
    }>
}