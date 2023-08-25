export interface FileChangeMetricsServiceQueryDataValues {
    id: string;
    githubName: string;
    githubLogin: string;
    githubAvatarUrl: string;
    additionSum: string;
    deletionsSum: string;
}

export interface FileChangeMetricsServiceResponse {
    results: Array<FileChangeMetricsServiceQueryDataValues>;

    totalAdditions: number;
    totalDeletions: number;
}
