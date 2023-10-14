import { CommitQualityMetricsDTO } from "@gitgrade/dtos";
import { Box } from "@primer/react";
import Indicator from "../../../../../../../commom/components/indicator";
import { qualityLevels } from "../../../../../../../commom/utils/commitQuality";

interface ICommitQualityIndicatorsProps {
    commitQualityChartMetrics: CommitQualityMetricsDTO;
}

export default function CommitQualityIndicators(
    props: ICommitQualityIndicatorsProps
) {
    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                mb: 4,
                gridTemplateColumns: ["1fr", "1fr 1fr 1fr"],
                alignItems: "stretch",
            }}
        >
            {qualityLevels.map((entry, index) => (
                <Box
                    sx={{ pr: 2 }}
                    key={entry.level}
                >
                    <Indicator
                        description={`com descrição ${entry.label}`}
                        header={
                            <>
                                <Box
                                    key={entry.level}
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: entry.color,
                                        borderRadius: "100%",
                                        flexShrink: 0,
                                    }}
                                />
                                {props.commitQualityChartMetrics.generalCommitQualityLevel.find(
                                    (a) => a.qualityLevel === entry.level
                                )?.qualityLevelCount ?? 0}
                            </>
                        }
                        sx={{ height: "100%", gridArea: `p${index}` }}
                    />
                </Box>
            ))}
        </Box>
    );
}
