import { Box, SegmentedControl } from "@primer/react";
import { HashIcon } from "@primer/octicons-react";
import SegmentedButtonLink from "../../../../../../../commom/components/segmentedControlLink";
import appRoutes from "../../../../../../../commom/routes/appRoutes";
import { useSearchParamsString } from "../../../../../../../commom/hooks/useRemainingSearchParams";

export default function CommitMetricsVisualizerControl() {
    const searchParamsString = useSearchParamsString();
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <SegmentedControl
                aria-labelledby="scLabel-horiz"
                aria-describedby="scCaption-horiz"
            >
                <SegmentedButtonLink
                    leadingIcon={HashIcon}
                    to={appRoutes.repo[
                        ":id"
                    ].metrics.commits.absolute.path.concat(searchParamsString)}
                >
                    Quantidade
                </SegmentedButtonLink>
                <SegmentedButtonLink
                    to={appRoutes.repo[
                        ":id"
                    ].metrics.commits.percentual.path.concat(
                        searchParamsString
                    )}
                >
                    Porcentagem
                </SegmentedButtonLink>
            </SegmentedControl>
        </Box>
    );
}
