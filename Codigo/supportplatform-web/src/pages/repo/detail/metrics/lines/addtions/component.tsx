import { useParams } from "react-router";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { Box } from "@primer/react";
import { useSearchParams } from "react-router-dom";
import { useLinesOfCodeMetricsGroupedByContributorByRepositoryId } from "../../../../../../commom/data/repo/metrics/linesOfCode";
import LinesOfCodeChart from "../components/linesOfCodeChart";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export default function RepositoryLinesOfCodeAddtionsMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const [searchParams] = useSearchParams();

    const { data: linesOfCodeMetricsData } =
        useLinesOfCodeMetricsGroupedByContributorByRepositoryId(id, {
            branchName:
                searchParams.get(pageRouteSearchParams.branch) ?? undefined,
            endedAt:
                searchParams.get(pageRouteSearchParams.endedAt) ?? undefined,
            startedAt:
                searchParams.get(pageRouteSearchParams.startedAt) ?? undefined,
        });

    return (
        <Box>
            {linesOfCodeMetricsData && (
                <LinesOfCodeChart
                    dataKey="addtions"
                    linesOfCodeMetrics={linesOfCodeMetricsData}
                />
            )}
        </Box>
    );
}
