export interface IssueMetricsDTO {
  issueDataPerContributor: Array<{
    contributor: {
      id: number;
      githubName: string;
      githubLogin: string | null;
      githubAvatarUrl: string | null;
    };
    assignedIssuesCount: number;
    authoredIssuesCount: number;
  }>;
  issuesOpennedCount: number;
  issuesClosedCount: number;
}

export interface IssueMetricQueryDTO {
  /** @isDate startedAt must be a valid date  */
  startedAt?: Date;
  /** @isDate endedAt must be a valid date */
  endedAt?: Date;
}
