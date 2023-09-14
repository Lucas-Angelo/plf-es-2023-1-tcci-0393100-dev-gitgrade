import { Box, SegmentedControl } from "@primer/react";
import { PlusIcon, DashIcon } from "@primer/octicons-react";
import SegmentedButtonLink from "../../../../../../../commom/components/segmentedControlLink";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { useSearchParamsString } from "../../../../../../../commom/hooks/useRemainingSearchParams";

export default function LinesOfCodeMetricsVisualizerControl() {
    const searchParamsString = useSearchParamsString();
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <SegmentedControl
                aria-labelledby="scLabel-horiz"
                aria-describedby="scCaption-horiz"
            >
                <SegmentedButtonLink
                    leadingIcon={PlusIcon}
                    to={appRoutes.repo[
                        ":id"
                    ].metrics.linesOfCode.addtions.path.concat(
                        searchParamsString
                    )}
                >
                    Adições
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    leadingIcon={DashIcon}
                    to={appRoutes.repo[
                        ":id"
                    ].metrics.linesOfCode.deletions.path.concat(
                        searchParamsString
                    )}
                >
                    Remoções
                </SegmentedButtonLink>
            </SegmentedControl>
        </Box>
    );
}
