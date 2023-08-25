export interface CommitMetricsServiceQueryDataValues {
    id: string;
    githubName: string;
    githubLogin: string;
    githubAvatarUrl: string;
    commitCount: string;
}

export interface CommitMetricsServiceResponse {
    results: Array<CommitMetricsServiceQueryDataValues>;

    totalCommitCount: number;
}
