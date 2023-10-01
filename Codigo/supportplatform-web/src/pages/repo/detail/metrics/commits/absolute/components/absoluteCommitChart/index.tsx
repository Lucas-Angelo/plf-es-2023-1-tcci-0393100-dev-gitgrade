import { CommitMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import {
    BarChart,
    ResponsiveContainer,
    Bar,
    CartesianGrid,
    YAxis,
    XAxis,
    Tooltip as ChartTooltip,
    Cell,
} from "recharts";
import ContribuitorsLegend from "../../../../../../../../commom/components/contribuitorsLegend";
import { getChartColor } from "../../../../../../../../commom/style/colors";

interface IAbsoluteCommitChartProps {
    commitMetrics: CommitMetricsDTO;
}

export default function AbsoluteCommitChart(props: IAbsoluteCommitChartProps) {
    const chartData = useMemo(
        () =>
            props.commitMetrics.commitsPerContributor.map(
                (contributorWithCommitMetrics) => ({
                    name: contributorWithCommitMetrics.contribuitor
                        ? contributorWithCommitMetrics.contribuitor
                              .githubName ??
                          contributorWithCommitMetrics.contribuitor.githubLogin
                        : "(Sem contribuidor)",
                    id: contributorWithCommitMetrics.contribuitor?.id ?? -1,
                    commitCount: contributorWithCommitMetrics.commitCount,
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
                <BarChart data={chartData}>
                    <CartesianGrid
                        stroke="#ccc"
                        strokeDasharray="5 5"
                    />
                    <XAxis dataKey="name" />
                    <Bar
                        dataKey="commitCount"
                        name="Quantidade de Commits"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getChartColor(index)}
                                name={entry.name}
                            />
                        ))}
                    </Bar>
                    <YAxis />
                    <ChartTooltip cursor={{ opacity: 0.5 }} />
                </BarChart>
            </ResponsiveContainer>
            <ContribuitorsLegend contributors={chartData}></ContribuitorsLegend>
        </>
    );
}
