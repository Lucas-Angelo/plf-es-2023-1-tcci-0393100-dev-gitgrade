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
import ContribuitorsLegend from "../../../../../../../commom/components/contribuitorsLegend";
import { getChartColor } from "../../../../../../../commom/style/colors";

interface ICommitChartProps {
    commitMetrics: CommitMetricsDTO;
}

export default function CommitChart(props: ICommitChartProps) {
    const chartData = useMemo(
        () =>
            props.commitMetrics.commitsPerContributor.map(
                (contributorWithCommitMetrics) => ({
                    name:
                        contributorWithCommitMetrics.contribuitor.githubName ??
                        contributorWithCommitMetrics.contribuitor.githubLogin,
                    commitCount: contributorWithCommitMetrics.commitCount,
                    id: contributorWithCommitMetrics.contribuitor.id,
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
                <BarChart
                    width={600}
                    height={300}
                    data={chartData}
                >
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
