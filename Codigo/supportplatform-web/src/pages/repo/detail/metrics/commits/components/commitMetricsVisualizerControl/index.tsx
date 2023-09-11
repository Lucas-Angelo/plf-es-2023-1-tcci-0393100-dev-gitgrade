import { Box, SegmentedControl } from "@primer/react";
import { HashIcon } from "@primer/octicons-react";
import SegmentedButtonLink from "../../../../../../../commom/components/segmentedControlLink";
import appRoutes from "../../../../../../../commom/routes/appRoutes";

export default function CommitMetricsVisualizerControl() {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <SegmentedControl
                aria-labelledby="scLabel-horiz"
                aria-describedby="scCaption-horiz"
            >
                <SegmentedButtonLink
                    leadingIcon={HashIcon}
                    to={appRoutes.repo[":id"].metrics.commits.absolute.path}
                >
                    Quantidade
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    to={appRoutes.repo[":id"].metrics.commits.percentual.path}
                >
                    Porcentagem
                </SegmentedButtonLink>
            </SegmentedControl>
        </Box>
    );
}
