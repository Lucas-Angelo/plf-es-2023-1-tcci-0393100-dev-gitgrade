import { useParams } from "react-router";
import { useCommitMetricsGroupedByContributorByRepositoryId } from "../../../../../commom/data/repo/metrics/commits";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { Box, Text } from "@primer/react";
import CommitChart from "./components/commitChart";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryCommitMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: commitMetricsData } =
        useCommitMetricsGroupedByContributorByRepositoryId(id);

    return (
        <Box>
            <Text sx={{ fontSize: 20, fontWeight: 500, ml: [0, 2, 4, 6] }}>
                Commits por contribuidor
            </Text>
            <Box
                sx={{
                    mx: [0, 0, 2, 4],
                    mt: 4,
                }}
            ></Box>
            {commitMetricsData && (
                <CommitChart commitMetrics={commitMetricsData} />
            )}
        </Box>
    );
}
