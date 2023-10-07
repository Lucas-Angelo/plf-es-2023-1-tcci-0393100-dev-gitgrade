import { CommitQualityMetricsDTO } from "@gitgrade/dtos";
import { CommitQualityMetricsServiceResponse } from "../interface/CommitMetrics";

export class CommitQualityMetricsMapper {
    toDto(
        serviceRespose: CommitQualityMetricsServiceResponse
    ): CommitQualityMetricsDTO {
        const commitQualityPerContributor = serviceRespose.results.reduce(
            (acc, result) => {
                const contributor = result.contributor
                    ? {
                          id: parseInt(result.contributor.id),
                          githubName: result.contributor.githubName,
                          githubLogin: result.contributor.githubLogin,
                          githubAvatarUrl: result.contributor.githubAvatarUrl,
                      }
                    : undefined;
                const commitQualityLevel = result.qualityLevel;
                const qualityLevelCount = parseInt(result.qualityLevelCount);
                const contributorCommitQualityObj = acc.find((item) =>
                    contributor
                        ? item.contributor?.id === contributor.id
                        : !item.contributor
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
        );
        const orderedCommitQualityPerContributor =
            commitQualityPerContributor.map((item) => {
                item.commitQualityLevel = item.commitQualityLevel.sort(
                    (a, b) => a.qualityLevel - b.qualityLevel
                );
                return item;
            });

        return {
            generalCommitQualityLevel: serviceRespose.generalCommitQualityLevel,
            commitQualityPerContributor: orderedCommitQualityPerContributor,
        };
    }
}
