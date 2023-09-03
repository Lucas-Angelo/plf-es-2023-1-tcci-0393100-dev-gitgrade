import { useParams } from "react-router";
import { useCommitMetricsGroupedByContributorByRepositoryId } from "../../../../../commom/data/repo/metrics/commits";
import appRoutes from "../../../../../commom/routes/appRoutes";

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryCommitMetricsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: commitMetricsData } =
        useCommitMetricsGroupedByContributorByRepositoryId(id);
    return (
        <div>
            {commitMetricsData?.commitsPerContributor.map(
                (contributorAndCommitMetrics) => {
                    return (
                        <div key={contributorAndCommitMetrics.contribuitor.id}>
                            {contributorAndCommitMetrics.contribuitor
                                .githubName ||
                                contributorAndCommitMetrics.contribuitor
                                    .githubLogin}
                            : {contributorAndCommitMetrics.commitCount} commits
                            (
                            {contributorAndCommitMetrics.commtiPercentage.toFixed(
                                2
                            )}
                            %)
                            <br />
                        </div>
                    );
                }
            )}
            total: {commitMetricsData?.totalCommitCount}
        </div>
    );
}
