import { Box } from "@primer/react";
import LinesOfCodeChart from "../components/linesOfCodeChart";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";

export default function RepositoryLinesOfCodeAddtionsMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeChart
                    dataKey="addtions"
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}
        </Box>
    );
}
