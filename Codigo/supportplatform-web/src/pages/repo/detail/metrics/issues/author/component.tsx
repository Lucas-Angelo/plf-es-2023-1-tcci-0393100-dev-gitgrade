import { Box } from "@primer/react";
import IssuesChart from "../components/issuesChart";
import { usePageIssueMetricsData } from "../hooks/useIssueMetricsPageData";

export default function RepositoryAuthorIssueMetricsPage() {
    const issueMetricsData = usePageIssueMetricsData();

    return (
        <Box>
            {issueMetricsData && (
                <IssuesChart
                    dataKey="authoredIssuesCount"
                    issueMetrics={issueMetricsData}
                />
            )}
        </Box>
    );
}
