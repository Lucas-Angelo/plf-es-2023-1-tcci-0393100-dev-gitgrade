import { Box } from "@primer/react";
import LinesOfCodeChart from "../components/linesOfCodeChart";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";
import ChartDetails from "../../components/chartDetails";

export default function RepositoryLinesOfCodeDeletionsMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeChart
                    dataKey="deletions"
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta quantas linhas de código foram removidos
                por cada contribuidor. São considerados as linhas dos commits
                que foram realizados entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
