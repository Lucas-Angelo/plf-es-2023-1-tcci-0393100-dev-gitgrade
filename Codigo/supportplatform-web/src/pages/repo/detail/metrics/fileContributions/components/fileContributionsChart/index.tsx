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

interface IFileContributionsChartProps {
    fileChangeMetrics: FileChangeMetricsDTO;
}

export default function FileContributionsChart(
    props: IFileContributionsChartProps
) {
    const chartData = useMemo(
        () =>
            props.fileChangeMetrics.fileChangesPerContributor.map(
                (contributorWithFileMetrics) => ({
                    name: contributorWithFileMetrics.contribuitor
                        ? contributorWithFileMetrics.contribuitor.githubName ??
                          contributorWithFileMetrics.contribuitor.githubLogin
                        : "(Sem contribuidor)",
                    fileCount: contributorWithFileMetrics.fileCount,
                    id: contributorWithFileMetrics.contribuitor?.id ?? -1,
                })
            ),
        [props.fileChangeMetrics]
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
                        dataKey="fileCount"
                        name="Arquivos alterados"
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
