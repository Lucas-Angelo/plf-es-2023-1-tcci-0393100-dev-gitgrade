import { CommitMetricsDTO } from "@gitgrade/dtos";
import { Box } from "@primer/react";
import Indicator from "../../../../../../../commom/components/indicator";
import { CommitIcon } from "@primer/octicons-react";

interface ICommitIndicatorsProps {
    commitMetrics: CommitMetricsDTO;
}

export default function CommitIndicators(props: ICommitIndicatorsProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: ["column", "row"],
                alignItems: "stretch",
                ml: [0, 8],
                mr: [0, 2],
                mt: 4,
            }}
        >
            <Box
                width="100%"
                sx={{ pr: 2 }}
            >
                <Indicator
                    leadingIcon={CommitIcon}
                    description="Commits foram realizados"
                    header={props.commitMetrics.totalCommitCount}
                    sx={{ height: "100%" }}
                />
            </Box>
        </Box>
    );
}
