import { Box } from "@primer/react";
import { fileChangeColors } from "../../../../../../../commom/style/colors";

export default function LinesOfCodeRelativeLegend() {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                ml: 2,
                mt: 2,
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: fileChangeColors.additions,
                        borderRadius: "100%",
                        flexShrink: 0,
                    }}
                ></Box>
                <Box>Adições</Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: fileChangeColors.deletions,
                        borderRadius: "100%",
                        flexShrink: 0,
                    }}
                ></Box>
                <Box>Remoções</Box>
            </Box>
        </Box>
    );
}
