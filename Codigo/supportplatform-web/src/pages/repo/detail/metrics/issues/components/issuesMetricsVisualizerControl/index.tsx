import { Box, SegmentedControl } from "@primer/react";
import { useSearchParamsString } from "../../../../../../../commom/hooks/useRemainingSearchParams";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import SegmentedButtonLink from "../../../../../../../commom/components/segmentedControlLink";
import {} from "@primer/octicons-react";

export default function IssuesMetricsVisualizerControl() {
    const searchParamsString = useSearchParamsString();
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <SegmentedControl
                aria-labelledby="scLabel-horiz"
                aria-describedby="scCaption-horiz"
            >
                <SegmentedButtonLink
                    to={appRoutes.repo[":id"].metrics.issues.author.path.concat(
                        searchParamsString
                    )}
                >
                    Autor
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    to={appRoutes.repo[
                        ":id"
                    ].metrics.issues.assignee.path.concat(searchParamsString)}
                >
                    Atribuído
                </SegmentedButtonLink>
            </SegmentedControl>
        </Box>
    );
}
