import { CommitQualityMetricsDTO } from "@gitgrade/dtos";
import { CommitQualityMetricsServiceResponse } from "../interface/CommitMetrics";

export class CommitQualityMetricsMapper {
    toDto(
        serviceRespose: CommitQualityMetricsServiceResponse
    ): CommitQualityMetricsDTO {
        return {
            generalCommitQualityLevel: serviceRespose.generalCommitQualityLevel,
            commitQualityPerContributor: serviceRespose.results.reduce(
                (acc, result) => {
                    const contributor = {
                        id: parseInt(result.contributor.id),
                        githubName: result.contributor.githubName,
                        githubLogin: result.contributor.githubLogin,
                        githubAvatarUrl: result.contributor.githubAvatarUrl,
                    };
                    const commitQualityLevel = result.qualityLevel;
                    const qualityLevelCount = parseInt(
                        result.qualityLevelCount
                    );
                    const contributorCommitQualityObj = acc.find(
                        (item) => item.contributor.id === contributor.id
                    );
                    if (!contributorCommitQualityObj) {
                        acc.push({
                            contributor,
                            commitQualityLevel: [
                                {
                                    qualityLevel: commitQualityLevel,
                                    qualityLevelCount,
                                },
                            ],
                        });
                    } else {
                        contributorCommitQualityObj.commitQualityLevel.push({
                            qualityLevel: commitQualityLevel,
                            qualityLevelCount,
                        });
                    }
                    return acc;
                },
                new Array<
                    CommitQualityMetricsDTO["commitQualityPerContributor"][number]
                >()
            ),
        };
    }
}
