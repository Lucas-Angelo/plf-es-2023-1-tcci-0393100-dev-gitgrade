import { Box, Text } from "@primer/react";
import { usePageCommitQualityMetricsData } from "./hooks/usePageCommitQualityMetricsData";
import CommitQualityChart from "./components/commitQualityChart";
import CommitQualityIndicators from "./components/commitQualityIndicators";

export default function RepositoryCommitQualityMetricsPage() {
    const commitQualityMetrics = usePageCommitQualityMetricsData();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Qualidade (tamanho) de descrição de commits por contribuidor
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
