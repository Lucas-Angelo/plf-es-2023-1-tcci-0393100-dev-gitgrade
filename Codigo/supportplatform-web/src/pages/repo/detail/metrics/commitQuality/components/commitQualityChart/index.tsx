import { CommitQualityMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    XAxis,
    Tooltip as ChartTooltip,
    YAxis,
} from "recharts";
import { qualityLevels } from "../../../../../../../commom/utils/commitQuality";
import CommitQualityLegend from "../commitQualityLegend";

interface ICommitQualityChartProps {
    commitQualityChartMetrics: CommitQualityMetricsDTO;
}

export default function CommitQualityChart(props: ICommitQualityChartProps) {
    const chartData = useMemo(
        () =>
            props.commitQualityChartMetrics.commitQualityPerContributor.map(
                (contributorData) => {
                    const contributorTotal =
                        contributorData.commitQualityLevel.reduce(
                            (total, qualityLevel) =>
                                total + qualityLevel.qualityLevelCount,
                            0
                        );
                    const qualityLevelContributorArray = qualityLevels.map(
                        (qualityLevel) => ({
                            count:
                                contributorData.commitQualityLevel.find(
                                    (contributorQualityLevel) =>
                                        contributorQualityLevel.qualityLevel ===
                                        qualityLevel.level
                                )?.qualityLevelCount ?? 0,
                            level: qualityLevel.level,
                        })
                    );

                    const contributorQualityLevelPerc =
                        qualityLevelContributorArray.map(
                            (qualityLevelContributor) =>
                                (100 * qualityLevelContributor.count) /
                                contributorTotal
                        );

                    return {
                        name:
                            contributorData.contributor.githubName ??
                            contributorData.contributor.githubLogin,
                        ...contributorQualityLevelPerc,
                    };
                }
            ),
        [props.commitQualityChartMetrics]
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
                    {qualityLevels.map((qualityLevel) => (
                        <Bar
                            dataKey={qualityLevel.level}
                            stackId="qualityLevel"
                            name={`${qualityLevel.label} (${qualityLevel.operator} ${qualityLevel.barrier})`}
                            key={qualityLevel.level}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={qualityLevel.color}
                                    name={entry.name}
                                />
                            ))}
                        </Bar>
                    ))}
                    <YAxis />
                    <ChartTooltip
                        cursor={{ opacity: 0.5 }}
                        formatter={(value) =>
                            `${Number(value).toFixed(2).toString()}%`
                        }
                    />
                </BarChart>
            </ResponsiveContainer>

            <CommitQualityLegend />
        </>
    );
}
