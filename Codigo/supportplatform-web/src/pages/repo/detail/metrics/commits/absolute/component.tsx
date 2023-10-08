import AbsoluteCommitChart from "./components/absoluteCommitChart";
import { Box } from "@primer/react";
import { useCommitMetricsPageData } from "../hooks/useCommitMetricsPageData";
import ChartDetails from "../../components/chartDetails";
import { usePageRepositoryContributors } from "../../../hooks/usePageRepositoryContributors";

export default function RepositoryAbsoluteCommitMetricsPage() {
    const commitMetricsData = useCommitMetricsPageData();
    const repositoryContributors = usePageRepositoryContributors();

    return (
        <Box>
            {commitMetricsData && repositoryContributors && (
                <AbsoluteCommitChart
                    repositoryContributors={repositoryContributors.results}
                    commitMetrics={commitMetricsData}
                />
            )}

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta quantos commits foram realizados por cada
                contribuidor. São considerados os commits que foram realizados
                entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
