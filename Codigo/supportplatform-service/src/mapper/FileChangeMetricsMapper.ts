import { FileChangeMetricsDTO } from "@gitgrade/dtos";
import { FileChangeMetricsServiceResponse } from "../interface/FileMetrics";

export class FileChangeMetricsMapper {
    toDto(
        serviceResponse: FileChangeMetricsServiceResponse
    ): FileChangeMetricsDTO {
        return {
            totalAdditions: serviceResponse.totalAdditions,
            totalDeletions: serviceResponse.totalDeletions,
            fileChangesPerContributor: serviceResponse.results.map((item) => ({
                contribuitor: {
                    id: Number(item.id),
                    githubName: item.githubName,
                    githubLogin: item.githubLogin,
                    githubAvatarUrl: item.githubAvatarUrl,
                },
                addtions: {
                    sum: Number(item.additionSum),
                    percentage:
                        (Number(item.additionSum) /
                            serviceResponse.totalAdditions) *
                        100,
                },
                deletions: {
                    sum: Number(item.deletionsSum),
                    percentage:
                        (Number(item.deletionsSum) /
                            serviceResponse.totalDeletions) *
                        100,
                },
            })),
        };
    }
}
