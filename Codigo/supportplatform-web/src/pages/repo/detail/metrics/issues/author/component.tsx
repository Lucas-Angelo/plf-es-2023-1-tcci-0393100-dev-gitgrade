import { Box } from "@primer/react";
import IssuesChart from "../components/issuesChart";
import { usePageIssueMetricsData } from "../hooks/useIssueMetricsPageData";
import ChartDetails from "../../components/chartDetails";
import { usePageRepositoryContributors } from "../../../hooks/usePageRepositoryContributors";

export default function RepositoryAuthorIssueMetricsPage() {
    const issueMetricsData = usePageIssueMetricsData();
    const repositoryCotributors = usePageRepositoryContributors();

    return (
        <Box>
            {issueMetricsData && repositoryCotributors && (
                <IssuesChart
                    dataKey="authoredIssuesCount"
                    issueMetrics={issueMetricsData}
                    repositoryCotributors={repositoryCotributors.results}
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
