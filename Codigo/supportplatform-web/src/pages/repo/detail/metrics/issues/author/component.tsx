import { Box } from "@primer/react";
import IssuesChart from "../components/issuesChart";
import { usePageIssueMetricsData } from "../hooks/useIssueMetricsPageData";
import ChartDetails from "../../components/chartDetails";

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

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta o número de issues criadas por cada
                contribuidor. São considerados as issues que foram criadas ou
                fechadas entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
