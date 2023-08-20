import { CommitMetricsDTO } from "@gitgrade/dtos";
import { CommitMetricsServiceResponse } from "../interface/CommitMetrics";

export class CommitMetricsMapper {
    toDto(serviceResponse: CommitMetricsServiceResponse): CommitMetricsDTO {
        return {
            totalCommitCount: serviceResponse.totalCommitCount,
            commitsPerContributor: serviceResponse.results.map((item) => ({
                contribuitor: {
                    id: Number(item.id),
                    githubName: item.githubName,
                    githubLogin: item.githubLogin,
                    githubAvatarUrl: item.githubAvatarUrl,
                },
                commitCount: Number(item.commitCount),
                commtiPercentage:
                    (Number(item.commitCount) /
                        serviceResponse.totalCommitCount) *
                    100,
            })),
        };
    }
}
