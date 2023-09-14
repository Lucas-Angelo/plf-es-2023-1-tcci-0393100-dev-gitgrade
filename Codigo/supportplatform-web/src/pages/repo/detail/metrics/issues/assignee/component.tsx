import { Box } from "@primer/react";
import IssuesChart from "../components/issuesChart";
import { usePageIssueMetricsData } from "../hooks/useIssueMetricsPageData";

export default function RepositoryAssigneeIssueMetricsPage() {
    const issueMetricsData = usePageIssueMetricsData();

    return (
        <Box>
            {issueMetricsData && (
                <IssuesChart
                    dataKey="assignedIssuesCount"
                    issueMetrics={issueMetricsData}
                />
            )}
        </Box>
    );
}
