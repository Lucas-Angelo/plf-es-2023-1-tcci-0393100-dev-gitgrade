import { Box } from "@primer/react";
import LinesOfCodeChart from "../components/linesOfCodeChart";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";
import ChartDetails from "../../components/chartDetails";
import { usePageRepositoryContributors } from "../../../hooks/usePageRepositoryContributors";

export default function RepositoryLinesOfCodeAddtionsMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();
    const repositoryCotributors = usePageRepositoryContributors();

    return (
        <Box>
            {linesOfCodeMetricsData && repositoryCotributors && (
                <LinesOfCodeChart
                    dataKey="addtions"
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                    repositoryCotributors={repositoryCotributors.results}
                />
            )}

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta quantas linhas de código foram
                adicionadas por cada contribuidor. São considerados as linhas
                dos commits que foram realizados entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
