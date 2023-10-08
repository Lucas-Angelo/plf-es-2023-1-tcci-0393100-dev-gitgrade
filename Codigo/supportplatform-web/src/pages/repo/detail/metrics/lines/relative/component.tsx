import { Box } from "@primer/react";
import { useLinesOfCodeMetricsPageData } from "../hooks/useLinesOfCodeMetricsPageData";
import LinesOfCodeRelativeChart from "../components/linesOfCodeRelativeChart";
import ChartDetails from "../../components/chartDetails";

export default function RepositoryLinesOfCodeRelativeMetricsPage() {
    const linesOfCodeMetricsData = useLinesOfCodeMetricsPageData();

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeRelativeChart
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta, para cada contribuidor, a relação da
                porcentagem de adições para deleções de linhas. São considerados
                as linhas dos commits que foram realizados entre a data
                selecionada.
            </ChartDetails>
        </Box>
    );
}
