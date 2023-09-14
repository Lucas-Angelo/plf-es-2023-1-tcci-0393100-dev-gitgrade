import { FileTypeMetricsDTO } from "@gitgrade/dtos";
import { useMemo } from "react";
import { ResponsiveContainer, Treemap } from "recharts";

interface IFileTypesMetricsChartProps {
    fileTypesMetrics: FileTypeMetricsDTO;
}

export default function FileTypesMetricsChart(
    props: IFileTypesMetricsChartProps
) {
    const chartData = useMemo(
        () =>
            props.fileTypesMetrics.general.map((generalExtensionData) => ({
                name: `.${generalExtensionData.extension} (${generalExtensionData.count})`,
                count: generalExtensionData.count,
            })),
        [props.fileTypesMetrics]
    );
    return (
        <ResponsiveContainer
            width="100%"
            aspect={7 / 3}
        >
            <Treemap
                data={chartData}
                dataKey="count"
                stroke="#fff"
                fill="#8884d8"
                animationDuration={600}
            />
        </ResponsiveContainer>
    );
}
