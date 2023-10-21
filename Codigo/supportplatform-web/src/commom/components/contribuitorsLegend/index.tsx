import { Box } from "@primer/react";
import { getContributorChartColor } from "../../style/colors";

interface IContribuitorsLegendProps {
    contributors: Array<{ name: string; id: number }>;
    repositoryContributors: Array<{ id: number }>;
}

export default function ContribuitorsLegend(props: IContribuitorsLegendProps) {
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
            {props.contributors.map((entry, index) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        ml: 4,
                    }}
                    key={entry.id}
                >
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: getContributorChartColor(
                                entry.id,
                                props.repositoryContributors.map((i) => i.id),
                                index
                            ),
                            borderRadius: "100%",
                            flexShrink: 0,
                        }}
                    ></Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box
                            className="one-line-truncate"
                            title={entry.name}
                        >
                            {entry.name}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
