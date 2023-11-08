import {
    CodeQualityResponseDTO,
    CodeQualityStatus,
} from "@gitgrade/dtos/dto/codeQuality";
import { Link as PrimerLink, Octicon, Timeline, Box } from "@primer/react";
import { Icon, XIcon, LogIcon, HourglassIcon } from "@primer/octicons-react";

interface ICommitQualityAnalisysTimelineProps {
    codeQualityAnalisysList: Array<CodeQualityResponseDTO>;
}
const dateFormater = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
});

const codeQualityStatusBagdeMap: Record<
    CodeQualityStatus,
    {
        icon: Icon;
        color?: string;
        text: string;
        iconColor?: string;
    }
> = {
    ANALYZED: {
        icon: LogIcon,
        color: "success.emphasis",
        text: "Análise concluída",
        iconColor: "fg.onEmphasis",
    },
    ANALYZING: {
        icon: HourglassIcon,
        color: "warning.emphasis",
        text: "Análise em andamento",
    },
    ERROR: {
        icon: XIcon,
        color: "danger.emphasis",
        text: "Erro na análise",
        iconColor: "fg.onEmphasis",
    },
};

export default function CommitQualityAnalisysTimeline(
    props: ICommitQualityAnalisysTimelineProps
) {
    return (
        <Timeline
            sx={{
                mt: 4,
            }}
        >
            {props.codeQualityAnalisysList.map((analisys) => (
                <Timeline.Item key={analisys.id}>
                    <Timeline.Badge
                        sx={{
                            bg: codeQualityStatusBagdeMap[analisys.status]
                                .color,
                        }}
                    >
                        <Octicon
                            icon={
                                codeQualityStatusBagdeMap[analisys.status].icon
                            }
                            sx={{
                                color: codeQualityStatusBagdeMap[
                                    analisys.status
                                ].iconColor,
                            }}
                        />
                    </Timeline.Badge>
                    <Timeline.Body>
                        <Box
                            sx={{
                                color: codeQualityStatusBagdeMap[
                                    analisys.status
                                ].color,
                                fontWeight: "bolder",
                            }}
                        >
                            {codeQualityStatusBagdeMap[analisys.status].text}
                        </Box>
                        <Box>
                            Executado em{" "}
                            {dateFormater.format(new Date(analisys.createdAt))}
                        </Box>
                        {analisys.status === CodeQualityStatus.ANALYZED && (
                            <PrimerLink
                                href={analisys.url}
                                target="_blank"
                            >
                                Acesso ao resultado
                            </PrimerLink>
                        )}
                    </Timeline.Body>
                </Timeline.Item>
            ))}
        </Timeline>
    );
}
