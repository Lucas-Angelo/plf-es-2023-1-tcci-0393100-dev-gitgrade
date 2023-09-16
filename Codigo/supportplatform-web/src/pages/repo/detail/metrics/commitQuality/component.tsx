import { Box, Text, Tooltip, Octicon } from "@primer/react";
import { usePageCommitQualityMetricsData } from "./hooks/usePageCommitQualityMetricsData";
import CommitQualityChart from "./components/commitQualityChart";
import CommitQualityIndicators from "./components/commitQualityIndicators";
import { InfoIcon } from "@primer/octicons-react";

export default function RepositoryCommitQualityMetricsPage() {
    const commitQualityMetrics = usePageCommitQualityMetricsData();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Qualidade (tamanho) de descrição de commits por contribuidor
                <Tooltip
                    wrap
                    aria-label='As descrições de commit que inciam com "Merge branch", "Merge remote-tracking branch" e "Merge pull request" são ignoradas, por serem descrições comumente geradas automaticamente pelo GitHub'
                >
                    <Octicon
                        sx={{ mb: 1, ml: 2 }}
                        icon={InfoIcon}
                    />
                </Tooltip>
            </Text>

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                {commitQualityMetrics && (
                    <CommitQualityIndicators
                        commitQualityChartMetrics={commitQualityMetrics}
                    />
                )}
                {commitQualityMetrics && (
                    <CommitQualityChart
                        commitQualityChartMetrics={commitQualityMetrics}
                    />
                )}
            </Box>
        </Box>
    );
}
