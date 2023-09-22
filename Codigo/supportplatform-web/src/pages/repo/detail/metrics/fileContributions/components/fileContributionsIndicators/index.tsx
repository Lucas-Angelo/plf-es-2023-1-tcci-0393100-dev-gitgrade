import { FileChangeMetricsDTO } from "@gitgrade/dtos";
import { Box } from "@primer/react";
import { FileDiffIcon } from "@primer/octicons-react";
import Indicator from "../../../../../../../commom/components/indicator";

interface IFileContributionsIndicatorsProps {
    fileChangeMetrics: FileChangeMetricsDTO;
}

export default function FileContributionsIndicators(
    props: IFileContributionsIndicatorsProps
) {
    return (
        <Box
            sx={{
                ml: [0, 2, 4, 6],
                mb: 4,
            }}
        >
            <Box
                width="100%"
                sx={{ pr: [0, 2] }}
            >
                <Indicator
                    leadingIcon={FileDiffIcon}
                    description="arquivos alterados"
                    header={props.fileChangeMetrics.fileCount}
                    sx={{ height: "100%" }}
                />
            </Box>
        </Box>
    );
}
