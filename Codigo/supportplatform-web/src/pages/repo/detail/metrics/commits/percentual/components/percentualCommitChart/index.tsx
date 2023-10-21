import { CommitMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as ChartTooltip,
} from "recharts";
import { getContributorChartColor } from "../../../../../../../../commom/style/colors";
import ContribuitorsLegend from "../../../../../../../../commom/components/contribuitorsLegend";

interface IPercentualCommitChartProps {
    commitMetrics: CommitMetricsDTO;
    repositoryContributors: Array<{ id: number }>;
}

export default function PercentualCommitChart(
    props: IPercentualCommitChartProps
) {
    const chartData = useMemo(
        () =>
            props.commitMetrics.commitsPerContributor.map(
                (contributorWithCommitMetrics) => ({
                    name: contributorWithCommitMetrics.contribuitor
                        ? contributorWithCommitMetrics.contribuitor
                              .githubName ??
                          contributorWithCommitMetrics.contribuitor.githubLogin
                        : "(Sem contribuidor)",
                    percentual: Number(
                        contributorWithCommitMetrics.commtiPercentage.toFixed(2)
                    ),
                    id: contributorWithCommitMetrics.contribuitor?.id ?? -1,
                })
            ),
        [props.commitMetrics]
    );

    return (
        <>
            <ResponsiveContainer
                width="100%"
                aspect={7 / 3}
            >
                <PieChart>
                    <Pie
                        data={chartData}
                        name="Porcentagem de Commits (%)"
                        dataKey="percentual"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${entry.id}`}
                                fill={getContributorChartColor(
                                    entry.id,
                                    props.repositoryContributors.map(
                                        (i) => i.id
                                    ),
                                    index
                                )}
                                name={entry.name}
                            />
                        ))}
                    </Pie>
                    <ChartTooltip
                        formatter={(value, name) => [
                            `${value.toString()}%`,
                            name,
                        ]}
                        cursor={{ opacity: 0.5 }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <ContribuitorsLegend
                contributors={chartData}
                repositoryContributors={props.repositoryContributors}
            />
        </>
    );
}
