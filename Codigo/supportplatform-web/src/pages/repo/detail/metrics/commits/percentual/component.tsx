import { Box } from "@primer/react";
import PercentualCommitChart from "./components/percentualCommitChart";
import { useCommitMetricsPageData } from "../hooks/useCommitMetricsPageData";
import ChartDetails from "../../components/chartDetails";
import { usePageRepositoryContributors } from "../../../hooks/usePageRepositoryContributors";

export default function RepositoryPercentualCommitMetricsPage() {
    const commitMetricsData = useCommitMetricsPageData();
    const repositoryContributors = usePageRepositoryContributors();

    return (
        <Box>
            {commitMetricsData && repositoryContributors && (
                <PercentualCommitChart
                    repositoryContributors={repositoryContributors.results}
                    commitMetrics={commitMetricsData}
                />
            )}

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta, para cada contribuidor a porcentagem de
                commits em relação ao total de commits filtrados. São
                considerados os commits que foram realizados entre a data
                selecionada.
            </ChartDetails>
        </Box>
    );
}
