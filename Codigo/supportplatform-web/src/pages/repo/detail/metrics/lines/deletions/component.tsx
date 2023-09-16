import { Box } from "@primer/react";
import LinesOfCodeChart from "../components/linesOfCodeChart";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";

export default function RepositoryLinesOfCodeDeletionsMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeChart
                    dataKey="deletions"
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}
        </Box>
    );
}
