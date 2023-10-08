import { Box } from "@primer/react";
import IssuesChart from "../components/issuesChart";
import { usePageIssueMetricsData } from "../hooks/useIssueMetricsPageData";
import ChartDetails from "../../components/chartDetails";

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

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta o número de issues atribuídas para cada
                contribuidor. São considerados as issues que foram criadas ou
                fechadas entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
