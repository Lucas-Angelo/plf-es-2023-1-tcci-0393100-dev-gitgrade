export interface CommitMetricsDTO {
  totalCommitCount: number;
  commitsPerContributor: Array<{
    contribuitor: {
      id: number;
      githubName: string;
      githubLogin: string;
      githubAvatarUrl: string;
    };
    commitCount: number;
    commtiPercentage: number;
  }>;
}

export interface CommitQualityMetricsDTO {
  generalCommitQualityLevel: Array<{
    qualityLevel: number;
    qualityLevelCount: number;
  }>;
  commitQualityPerContributor: Array<{
    contributor: {
      id: number;
      githubName: string;
      githubLogin: string;
      githubAvatarUrl: string;
    };
    commitQualityLevel: Array<{
      qualityLevel: number;
      qualityLevelCount: number;
    }>;
  }>;
}
