import { Box, Text } from "@primer/react";
import IssuesMetricsVisualizerControl from "./components/issuesMetricsVisualizerControl";
import { Outlet } from "react-router";

export default function RepositoryIssuesMetricsPage() {
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
                <IssuesMetricsVisualizerControl />
                <Outlet />
            </Box>
        </Box>
    );
}
