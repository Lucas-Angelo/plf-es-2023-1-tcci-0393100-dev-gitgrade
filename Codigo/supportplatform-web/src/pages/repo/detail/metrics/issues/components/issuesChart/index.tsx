import { IssueMetricsDTO } from "@gitgrade/dtos";
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

interface IIssuesChartProps {
    issueMetrics: IssueMetricsDTO;
    dataKey: "authoredIssuesCount" | "assignedIssuesCount";
}

export default function IssuesChart(props: IIssuesChartProps) {
    const chartData = useMemo(
        () =>
            props.issueMetrics.issueDataPerContributor.map(
                (contributorWithIssueMetrics) => ({
                    name:
                        contributorWithIssueMetrics.contributor.githubName ??
                        contributorWithIssueMetrics.contributor.githubLogin,
                    authoredIssuesCount:
                        contributorWithIssueMetrics.authoredIssuesCount,
                    assignedIssuesCount:
                        contributorWithIssueMetrics.assignedIssuesCount,
                    id: contributorWithIssueMetrics.contributor.id,
                })
            ),
        [props.issueMetrics]
    );

    const barName =
        props.dataKey === "authoredIssuesCount"
            ? "Issues criadas"
            : "Issues atribuídas";

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
