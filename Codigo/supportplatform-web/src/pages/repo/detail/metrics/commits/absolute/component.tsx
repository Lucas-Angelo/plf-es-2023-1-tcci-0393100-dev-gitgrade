import AbsoluteCommitChart from "./components/absoluteCommitChart";
import { Box } from "@primer/react";
import { useCommitMetricsPageData } from "../hooks/useCommitMetricsPageData";

export default function RepositoryAbsoluteCommitMetricsPage() {
    const commitMetricsData = useCommitMetricsPageData();

    return (
        <Box>
            {commitMetricsData && (
                <AbsoluteCommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
