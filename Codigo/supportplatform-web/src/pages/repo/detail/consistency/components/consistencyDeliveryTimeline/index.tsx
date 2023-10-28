import { ConsistencyRuleDeliveryResponseDTO } from "@gitgrade/dtos";
import {
    Octicon,
    Timeline,
    Box,
    RelativeTime,
    Label,
    Truncate,
} from "@primer/react";
import {
    UnverifiedIcon,
    RocketIcon,
    StopIcon,
    StopwatchIcon,
    CircleSlashIcon,
    FileIcon,
    MoonIcon,
    CalendarIcon,
    Icon,
} from "@primer/octicons-react";
import { ConsistencyRuleDeliveryStatus } from "@gitgrade/dtos/dto/consistencyRuleDelivery";

interface IConsistencyDeliveryTimelineProps {
    consistencyRuleDeliveryList: Array<ConsistencyRuleDeliveryResponseDTO>;
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
});

const consistencyStatusBagdeMap: Record<
    ConsistencyRuleDeliveryStatus,
    {
        icon: Icon;
        color?: string;
        bg?: string;
        condensed?: boolean;
        text: string;
        labelVariant: "default" | "severe" | "success" | "attention" | "danger";
    }
> = {
    AWAITING_DELIVERY: {
        icon: UnverifiedIcon,
        condensed: true,
        text: "Aguardando entrega...",
        labelVariant: "default",
    },
    NOT_DELIVERED: {
        icon: CircleSlashIcon,
        color: "danger.emphasis",
        bg: "danger.muted",
        text: "Não entregue!",
        labelVariant: "danger",
    },
    DELIVERED_LATE: {
        icon: StopwatchIcon,
        color: "attention.emphasis",
        bg: "attention.muted",
        text: "Entregue com atraso!",
        labelVariant: "attention",
    },
    DELIVERED_ON_TIME: {
        icon: RocketIcon,
        color: "success.emphasis",
        bg: "success.muted",
        text: "Entregue no prazo!",
        labelVariant: "success",
    },
    DELIVERED_WITH_INVALIDITY: {
        icon: StopIcon,
        color: "severe.emphasis",
        bg: "severe.muted",
        text: "Entregue com inconsistência!",
        labelVariant: "severe",
    },
};

export default function ConsistencyDeliveryTimeline(
    props: IConsistencyDeliveryTimelineProps
) {
    return (
        <Timeline>
            {props.consistencyRuleDeliveryList.map(
                (consistencyRuleDelivery) => (
                    <Timeline.Item
                        key={consistencyRuleDelivery.id}
                        condensed={
                            consistencyStatusBagdeMap[
                                consistencyRuleDelivery.status
                            ].condensed
                        }
                    >
                        <Timeline.Badge
                            sx={{
                                bg: consistencyStatusBagdeMap[
                                    consistencyRuleDelivery.status
                                ].color,
                            }}
                        >
                            <Octicon
                                sx={{
                                    color: !consistencyStatusBagdeMap[
                                        consistencyRuleDelivery.status
                                    ].condensed
                                        ? "fg.onEmphasis"
                                        : undefined,
                                }}
                                icon={
                                    consistencyStatusBagdeMap[
                                        consistencyRuleDelivery.status
                                    ].icon
                                }
                            />
                        </Timeline.Badge>
                        <Timeline.Body
                            sx={
                                !consistencyStatusBagdeMap[
                                    consistencyRuleDelivery.status
                                ].condensed
                                    ? {
                                          p: 3,
                                          bg: consistencyStatusBagdeMap[
                                              consistencyRuleDelivery.status
                                          ].bg,
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          borderColor:
                                              consistencyStatusBagdeMap[
                                                  consistencyRuleDelivery.status
                                              ].color,
                                          borderRadius: 2,
                                          color: consistencyStatusBagdeMap[
                                              consistencyRuleDelivery.status
                                          ].color,
                                      }
                                    : {
                                          mb: 4,
                                      }
                            }
                        >
                            <Box
                                sx={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {
                                    consistencyRuleDelivery.consistencyRule
                                        .description
                                }
                                <Label
                                    variant={
                                        consistencyStatusBagdeMap[
                                            consistencyRuleDelivery.status
                                        ].labelVariant
                                    }
                                >
                                    <Octicon
                                        icon={FileIcon}
                                        sx={{ mr: 2 }}
                                    />
                                    <Truncate
                                        maxWidth={150}
                                        title={
                                            consistencyRuleDelivery
                                                .consistencyRule.filePath
                                        }
                                    >
                                        {
                                            consistencyRuleDelivery
                                                .consistencyRule.filePath
                                        }
                                    </Truncate>
                                </Label>
                            </Box>
                            <Box
                                sx={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    my: 1,
                                }}
                            >
                                <Label
                                    variant={
                                        consistencyStatusBagdeMap[
                                            consistencyRuleDelivery.status
                                        ].labelVariant
                                    }
                                >
                                    <Octicon
                                        icon={MoonIcon}
                                        sx={{ mr: 2 }}
                                    />
                                    <Truncate
                                        maxWidth={100}
                                        title={
                                            consistencyRuleDelivery
                                                .consistencyRule.sprint.name
                                        }
                                    >
                                        {
                                            consistencyRuleDelivery
                                                .consistencyRule.sprint.name
                                        }
                                    </Truncate>
                                </Label>
                                <Label
                                    variant={
                                        consistencyStatusBagdeMap[
                                            consistencyRuleDelivery.status
                                        ].labelVariant
                                    }
                                >
                                    <Octicon
                                        icon={CalendarIcon}
                                        sx={{ mr: 2 }}
                                    />
                                    Término em{" "}
                                    {dateFormat.format(
                                        new Date(
                                            consistencyRuleDelivery.consistencyRule.sprint.end_date
                                        )
                                    )}
                                </Label>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        fontWeight: "bolder",
                                    }}
                                    as="span"
                                >
                                    {
                                        consistencyStatusBagdeMap[
                                            consistencyRuleDelivery.status
                                        ].text
                                    }
                                </Box>
                                {consistencyRuleDelivery.deliveryAt && (
                                    <RelativeTime
                                        format="relative"
                                        sx={{ ml: 2 }}
                                        date={
                                            new Date(
                                                consistencyRuleDelivery.deliveryAt
                                            )
                                        }
                                        lang="pt-BR"
                                    />
                                )}
                            </Box>
                        </Timeline.Body>
                    </Timeline.Item>
                )
            )}
        </Timeline>
    );
}
