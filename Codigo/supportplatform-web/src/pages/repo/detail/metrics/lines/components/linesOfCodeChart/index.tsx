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
import { getContributorChartColor } from "../../../../../../../commom/style/colors";
import ContribuitorsLegend from "../../../../../../../commom/components/contribuitorsLegend";

interface ILinesOfCodeChartProps {
    linesOfCodeMetrics: FileChangeMetricsDTO;
    repositoryCotributors: Array<{ id: number }>;
    dataKey: "addtions" | "deletions";
}

export default function LinesOfCodeChart(props: ILinesOfCodeChartProps) {
    const chartData = useMemo(
        () =>
            props.linesOfCodeMetrics.fileChangesPerContributor.map(
                (contributorWithFileMetrics) => ({
                    name: contributorWithFileMetrics.contribuitor
                        ? contributorWithFileMetrics.contribuitor.githubName ??
                          contributorWithFileMetrics.contribuitor.githubLogin
                        : "(Sem contribuidor)",
                    addtions: contributorWithFileMetrics.addtions.sum,
                    deletions: contributorWithFileMetrics.deletions.sum,
                    id: contributorWithFileMetrics.contribuitor?.id ?? -1,
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
                                fill={getContributorChartColor(
                                    entry.id,
                                    props.repositoryCotributors.map(
                                        (i) => i.id
                                    ),
                                    index
                                )}
                                name={entry.name}
                            />
                        ))}
                    </Bar>
                    <YAxis />
                    <ChartTooltip cursor={{ opacity: 0.5 }} />
                </BarChart>
            </ResponsiveContainer>
            <ContribuitorsLegend
                contributors={chartData}
                repositoryContributors={props.repositoryCotributors}
            ></ContribuitorsLegend>
        </>
    );
}
