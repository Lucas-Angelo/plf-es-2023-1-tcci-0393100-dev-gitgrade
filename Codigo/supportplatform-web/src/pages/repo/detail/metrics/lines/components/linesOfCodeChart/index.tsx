import { FileChangeMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
} from "recharts";
import { getChartColor } from "../../../../../../../commom/style/colors";
import ContribuitorsLegend from "../../../../../../../commom/components/contribuitorsLegend";

interface ILinesOfCodeChartProps {
    linesOfCodeMetrics: FileChangeMetricsDTO;
    dataKey: "addtions" | "deletions";
}

export default function LinesOfCodeChart(props: ILinesOfCodeChartProps) {
    const chartData = useMemo(
        () =>
            props.linesOfCodeMetrics.fileChangesPerContributor.map(
                (contributorWithCommitMetrics) => ({
                    name:
                        contributorWithCommitMetrics.contribuitor.githubName ??
                        contributorWithCommitMetrics.contribuitor.githubLogin,
                    addtions: contributorWithCommitMetrics.addtions.sum,
                    deletions: contributorWithCommitMetrics.deletions.sum,
                    id: contributorWithCommitMetrics.contribuitor.id,
                })
            ),
        [props.linesOfCodeMetrics]
    );

    const barName = props.dataKey === "addtions" ? "Adições" : "Remoções";

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
                        dataKey={props.dataKey}
                        name={barName}
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
