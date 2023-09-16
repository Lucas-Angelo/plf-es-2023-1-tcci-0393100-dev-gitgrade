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

export interface CommitQualityMetricsServiceQueryDataValues {
    qualityLevel: number;
    qualityLevelCount: string;
    contributor: {
        id: string;
        githubName: string;
        githubLogin: string;
        githubAvatarUrl: string;
    };
}

export interface CommitQualityMetricsServiceResponse {
    results: Array<CommitQualityMetricsServiceQueryDataValues>;

    generalCommitQualityLevel: Array<{
        qualityLevel: number;
        qualityLevelCount: number;
    }>;
}
