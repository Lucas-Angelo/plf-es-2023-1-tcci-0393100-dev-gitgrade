import { Box, Text } from "@primer/react";
import { useFileContributionsMetricsPageData } from "./hooks/useFileContributionsMetricsPageData";
import FileContributionsIndicators from "./components/fileContributionsIndicators";
import FileContributionsChart from "./components/fileContributionsChart";
import ChartDetails from "../components/chartDetails";
import NoContributorDetails from "../components/noContributorDetails";
import { usePageRepositoryContributors } from "../../hooks/usePageRepositoryContributors";

export default function RepositoryFileContributionsMetricsPage() {
    const fileChangeMetrics = useFileContributionsMetricsPageData();
    const hasNoContributorMetrics =
        fileChangeMetrics?.fileChangesPerContributor.some(
            (item) => !item.contribuitor
        );
    const repositoryContributors = usePageRepositoryContributors();
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Contribuições de arquivos por contribuidor
            </Text>

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                {fileChangeMetrics && (
                    <FileContributionsIndicators
                        fileChangeMetrics={fileChangeMetrics}
                    />
                )}
                {fileChangeMetrics && repositoryContributors && (
                    <FileContributionsChart
                        fileChangeMetrics={fileChangeMetrics}
                        repositoryContributors={repositoryContributors.results}
                    />
                )}

                <ChartDetails sx={{ mt: 8 }}>
                    Esse gráfico soma todos os arquivos manipulados por cada
                    contribuidor. Os arquivos considerados no somatório podem
                    ter sido adicionados, removidos, deletados, alterados ou
                    renomeados. São filtrados os arquivos pertencentes ao
                    commits que foram realizados entre a data selecionada.
                </ChartDetails>

                {hasNoContributorMetrics && (
                    <NoContributorDetails sx={{ mt: 4 }} />
                )}
            </Box>
        </Box>
    );
}
