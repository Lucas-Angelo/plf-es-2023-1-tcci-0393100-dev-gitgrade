import { Outlet } from "react-router";
import { Box, Text } from "@primer/react";
import CommitMetricsVisualizerControl from "./components/commitMetricsVisualizerControl";
import { useCommitMetricsPageData } from "./hooks/useCommitMetricsPageData";
import CommitIndicators from "./components/commitIndicators";

export default function RepositoryCommitMetricsPage() {
    const commitMetrics = useCommitMetricsPageData();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Commits por contribuidor
            </Text>

            {commitMetrics && (
                <CommitIndicators commitMetrics={commitMetrics} />
            )}

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                <CommitMetricsVisualizerControl />
                <Outlet />
            </Box>
        </Box>
    );
}
