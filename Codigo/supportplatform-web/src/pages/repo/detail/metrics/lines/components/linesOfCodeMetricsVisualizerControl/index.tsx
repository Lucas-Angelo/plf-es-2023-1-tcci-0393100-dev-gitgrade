import { Box, SegmentedControl } from "@primer/react";
import {
    DiffAddedIcon,
    DiffRemovedIcon,
    DiffModifiedIcon,
} from "@primer/octicons-react";
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
                    leadingIcon={DiffAddedIcon}
                    to={appRoutes.repo[
                        "detail"
                    ].metrics.linesOfCode.addtions.path.concat(
                        searchParamsString
                    )}
                >
                    Adições
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    leadingIcon={DiffRemovedIcon}
                    to={appRoutes.repo[
                        "detail"
                    ].metrics.linesOfCode.deletions.path.concat(
                        searchParamsString
                    )}
                >
                    Remoções
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    leadingIcon={DiffModifiedIcon}
                    to={appRoutes.repo[
                        "detail"
                    ].metrics.linesOfCode.relative.path.concat(
                        searchParamsString
                    )}
                >
                    Relativo
                </SegmentedButtonLink>
            </SegmentedControl>
        </Box>
    );
}
