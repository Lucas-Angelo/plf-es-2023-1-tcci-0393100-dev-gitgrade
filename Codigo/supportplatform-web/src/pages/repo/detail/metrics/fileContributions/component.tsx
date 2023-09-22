import { Box, Text } from "@primer/react";
import { useFileContributionsMetricsPageData } from "./hooks/useFileContributionsMetricsPageData";
import FileContributionsIndicators from "./components/fileContributionsIndicators";
import FileContributionsChart from "./components/fileContributionsChart";

export default function RepositoryFileContributionsMetricsPage() {
    const fileChangeMetrics = useFileContributionsMetricsPageData();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Contribuições de arquivos por contribuidor
            </Text>

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                {fileChangeMetrics && (
                    <FileContributionsIndicators
                        fileChangeMetrics={fileChangeMetrics}
                    />
                )}
                {fileChangeMetrics && (
                    <FileContributionsChart
                        fileChangeMetrics={fileChangeMetrics}
                    />
                )}
            </Box>
        </Box>
    );
}
