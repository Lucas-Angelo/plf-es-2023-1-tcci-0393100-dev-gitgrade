import { FileChangeMetricsDTO } from "@gitgrade/dtos";
import { Box } from "@primer/react";
import { DiffAddedIcon, DiffRemovedIcon } from "@primer/octicons-react";
import Indicator from "../../../../../../../commom/components/indicator";

interface ILinesOfCodeIndicatorsProps {
    fileChangeMetrics: FileChangeMetricsDTO;
}

export default function LinesOfCodeIndicators(
    props: ILinesOfCodeIndicatorsProps
) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: ["column", "row"],
                alignItems: "stretch",
                ml: [0, 2, 4, 6],
            }}
        >
            <Box
                width={["100%", "50%"]}
                sx={{ pr: [0, 2] }}
            >
                <Indicator
                    leadingIcon={DiffAddedIcon}
                    description="linhas adicionadas"
                    header={props.fileChangeMetrics.totalAdditions}
                    sx={{ height: "100%" }}
                />
            </Box>
            <Box
                width={["100%", "50%"]}
                sx={{ pl: [0, 2], py: [2, 0] }}
            >
                <Indicator
                    leadingIcon={DiffRemovedIcon}
                    description="linhas deletadas"
                    header={props.fileChangeMetrics.totalDeletions}
                    sx={{ height: "100%" }}
                />
            </Box>
        </Box>
    );
}
