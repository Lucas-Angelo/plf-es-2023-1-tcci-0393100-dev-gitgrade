import { Box } from "@primer/react";
import PercentualCommitChart from "./components/percentualCommitChart";
import { useCommitMetricsPageData } from "../hooks/useCommitMetricsPageData";

export default function RepositoryPercentualCommitMetricsPage() {
    const commitMetricsData = useCommitMetricsPageData();

    return (
        <Box>
            {commitMetricsData && (
                <PercentualCommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
