import { Box, Text } from "@primer/react";
import IssuesMetricsVisualizerControl from "./components/issuesMetricsVisualizerControl";
import { Outlet } from "react-router";
import IssuesIndicators from "./components/issuesIndicators";
import { usePageIssueMetricsData } from "./hooks/useIssueMetricsPageData";

export default function RepositoryIssuesMetricsPage() {
    const issueMetrics = usePageIssueMetricsData();

    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Issues por contribuidor
            </Text>

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                {issueMetrics && (
                    <IssuesIndicators issueMetrics={issueMetrics} />
                )}
                <IssuesMetricsVisualizerControl />
                <Outlet />
            </Box>
        </Box>
    );
}
