import { Box } from "@primer/react";
import { qualityLevels } from "../../../../../../../commom/utils/commitQuality";

export default function CommitQualityLegend() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: [
                    "1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                    "1fr 1fr 1fr",
                ],
                gap: 2,
                ml: 2,
                mt: 2,
            }}
        >
            {qualityLevels.map((entry) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        ml: 4,
                    }}
                    key={entry.level}
                >
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: entry.color,
                            borderRadius: "100%",
                            flexShrink: 0,
                        }}
                    ></Box>
                    <Box sx={{ flexGrow: 1 }}>
                        {entry.label} ({entry.operator} {entry.barrier}{" "}
                        caracteres)
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
