import { Box, Text } from "@primer/react";
import FileTypesMetricsChart from "./components/fileTypeMetricsChart";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useFileTypeMetricsGroupedByContributorByRepositoryId } from "../../../../../commom/data/repo/metrics/fileTypes";
import ChartDetails from "../components/chartDetails";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo["detail"].search;

export default function RepositoryFileTypeMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: fileTypeMetricsData } =
        useFileTypeMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
            contributors:
                searchParams.getAll(pageRouteSearchParams.contributor) ??
                undefined,
            filterWithNoContributor:
                searchParams.get(
                    pageRouteSearchParams.filterWithNoContributor
                ) === "true"
                    ? true
                    : false,
        });
    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Tipos de arquivos contribuídos
            </Text>

            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            >
                {fileTypeMetricsData && (
                    <FileTypesMetricsChart
                        fileTypesMetrics={fileTypeMetricsData}
                    />
                )}
            </Box>

            <ChartDetails sx={{ mt: 8 }}>
                Esse gráfico apresenta a quantidade de arquivos contribuídos
                para cada tipo de extensão. O tamanho dos setores é proporcional
                a porcentagem do número de arquivos da extensão para o total de
                arquivos . São considerados os arquivos dos commits que foram
                realizados entre a data selecionada.
            </ChartDetails>
        </Box>
    );
}
