import { Outlet } from "react-router";
import { Box, Text } from "@primer/react";
import LinesOfCodeMetricsVisualizerControl from "./components/linesOfCodeMetricsVisualizerControl";
import LinesOfCodeIndicators from "./components/linesOfCodeIndicators";
import { useLinesOfCodeMetricsPageData } from "./hooks/useLinesOfCodeMetricsPageData";

export default function RepositoryLinesOfCodeMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Linhas de código por contribuidor
            </Text>

            {linesOfCodeMetricsData && (
                <LinesOfCodeIndicators
                    fileChangeMetrics={linesOfCodeMetricsData}
                />
            )}

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                <LinesOfCodeMetricsVisualizerControl />
                <Outlet />
            </Box>
        </Box>
    );
}
