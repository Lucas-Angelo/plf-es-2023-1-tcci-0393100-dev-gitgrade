import { IssueMetricsDTO } from "@gitgrade/dtos";
import { Box } from "@primer/react";
import { IssueOpenedIcon, IssueClosedIcon } from "@primer/octicons-react";
import Indicator from "../../../../../../../commom/components/indicator";

interface IIssuesIndicatorsProps {
    issueMetrics: IssueMetricsDTO;
}

export default function IssuesIndicators(props: IIssuesIndicatorsProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: ["column", "row"],
                alignItems: "stretch",
            }}
        >
            <Box
                width={["100%", "50%"]}
                sx={{ pr: 2 }}
            >
                <Indicator
                    leadingIcon={IssueOpenedIcon}
                    title="Issues foram abertas"
                    metric={props.issueMetrics.issuesOpennedCount}
                    sx={{ height: "100%" }}
                />
            </Box>
            <Box
                width={["100%", "50%"]}
                sx={{ pl: 2 }}
            >
                <Indicator
                    leadingIcon={IssueClosedIcon}
                    title="Issues foram fechadas"
                    metric={props.issueMetrics.issuesClosedCount}
                    sx={{ height: "100%" }}
                />
            </Box>
        </Box>
    );
}
