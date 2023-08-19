import { CommitMetricsDTO } from "@gitgrade/dtos";
import { CommitMetricsServiceResponse } from "../interface/CommitMetrics";

export class CommitMetricsMapper {
    toDto(
        serviceResponse: CommitMetricsServiceResponse,
        totalCommits: number
    ): CommitMetricsDTO {
        console.log(serviceResponse.commitCount);
        return {
            contribuitor: {
                id: Number(serviceResponse.id),
                githubName: serviceResponse.githubName,
                githubLogin: serviceResponse.githubLogin,
                githubAvatarUrl: serviceResponse.githubAvatarUrl,
            },
            commitCount: Number(serviceResponse.commitCount),
            commtiPercentage:
                (Number(serviceResponse.commitCount) / totalCommits) * 100,
        };
    }
}
