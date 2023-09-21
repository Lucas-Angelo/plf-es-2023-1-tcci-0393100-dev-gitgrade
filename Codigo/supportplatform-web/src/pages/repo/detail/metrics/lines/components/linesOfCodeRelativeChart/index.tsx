import { FileChangeMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
} from "recharts";
import LinesOfCodeRelativeLegend from "../linesOfCodeRelativeLegend";
import { fileChangeColors } from "../../../../../../../commom/style/colors";

interface ILinesOfCodeRelativeChartProps {
    linesOfCodeMetrics: FileChangeMetricsDTO;
}

export default function LinesOfCodeRelativeChart(
    props: ILinesOfCodeRelativeChartProps
) {
    const chartData = useMemo(
        () =>
            props.linesOfCodeMetrics.fileChangesPerContributor.map(
                (contributorWithCommitMetrics) => ({
                    name:
                        contributorWithCommitMetrics.contribuitor.githubName ??
                        contributorWithCommitMetrics.contribuitor.githubLogin,
                    additions:
                        (100 * contributorWithCommitMetrics.addtions.sum) /
                        (contributorWithCommitMetrics.addtions.sum +
                            contributorWithCommitMetrics.deletions.sum),
                    deletions:
                        (100 * contributorWithCommitMetrics.deletions.sum) /
                        (contributorWithCommitMetrics.addtions.sum +
                            contributorWithCommitMetrics.deletions.sum),
                    id: contributorWithCommitMetrics.contribuitor.id,
                })
            ),
        [props.linesOfCodeMetrics]
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
                        dataKey="additions"
                        stackId="linesOfCode"
                        name="Adições"
                        fill={fileChangeColors.additions}
                    />
                    <Bar
                        dataKey="deletions"
                        stackId="linesOfCode"
                        name="Remoções"
                        fill={fileChangeColors.deletions}
                    />

                    <YAxis />
                    <ChartTooltip
                        cursor={{ opacity: 0.5 }}
                        formatter={(value) =>
                            `${Number(value).toFixed(2).toString()}%`
                        }
                    />
                </BarChart>
            </ResponsiveContainer>

            <LinesOfCodeRelativeLegend />
        </>
    );
}
