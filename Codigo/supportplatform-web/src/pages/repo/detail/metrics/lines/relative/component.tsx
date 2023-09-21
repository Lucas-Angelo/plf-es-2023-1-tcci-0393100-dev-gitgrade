import { Box } from "@primer/react";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";
import LinesOfCodeRelativeChart from "../components/linesOfCodeRelativeChart";

export default function RepositoryLinesOfCodeRelativeMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeRelativeChart
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}
        </Box>
    );
}
