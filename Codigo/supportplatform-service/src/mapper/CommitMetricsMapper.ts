import { CommitMetricsDTO } from "@gitgrade/dtos";
import { CommitMetricsServiceResponse } from "../interface/CommitMetrics";

export class CommitMetricsMapper {
    toDto(serviceResponse: CommitMetricsServiceResponse): CommitMetricsDTO {
        return {
            totalCommitCount: serviceResponse.totalCommitCount,
            commitsPerContributor: serviceResponse.results.map((item) => ({
                contribuitor: item.contributor
                    ? {
                          id: Number(item.contributor.id),
                          githubName: item.contributor.githubName,
                          githubLogin: item.contributor.githubLogin,
                          githubAvatarUrl: item.contributor.githubAvatarUrl,
                      }
                    : undefined,
                commitCount: Number(item.commitCount),
                commtiPercentage:
                    (Number(item.commitCount) /
                        serviceResponse.totalCommitCount) *
                    100,
            })),
        };
    }
}
