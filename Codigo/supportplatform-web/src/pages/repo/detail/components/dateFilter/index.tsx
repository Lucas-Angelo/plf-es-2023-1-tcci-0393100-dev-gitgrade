import { AnchoredOverlay, Box, Octicon } from "@primer/react";
import { FilterIcon } from "@primer/octicons-react";
import React, { useState } from "react";
import DateFilterForm from "../dateFilterForm";
import { useSearchParams } from "react-router-dom";
import {
    getIfDateRangeIsValid,
    getIfDateIsValid,
} from "../../../../../commom/utils/date";
import appRoutes from "../../../../../commom/routes/appRoutes";
import SprintFilter from "../../../../../commom/components/sprintFilter";
import { SprintResponseDTO } from "@gitgrade/dtos";

interface IDateFilterProps {
    repositoryGithubCreatedAt?: Date;
    evaluationMethodId: number | undefined;
    children?: React.ReactNode;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
});

export function formatDateRange(
    startedAt: Date | undefined,
    endedAt: Date | undefined
) {
    const isStartedAtAValidDate = startedAt && getIfDateIsValid(startedAt);
    const isEndedAtAValidDate = endedAt && getIfDateIsValid(endedAt);
    const isRangeValid =
        isStartedAtAValidDate &&
        isEndedAtAValidDate &&
        getIfDateRangeIsValid(startedAt, endedAt);

    if (isRangeValid) {
        return dateTimeFormat.formatRange(startedAt, endedAt);
    } else if (isStartedAtAValidDate && !isEndedAtAValidDate) {
        return `a partir de ${dateTimeFormat.format(startedAt)}`;
    } else if (isEndedAtAValidDate && !isStartedAtAValidDate) {
        return `até ${dateTimeFormat.format(endedAt)}`;
    } else {
        return "Todo o período";
    }
}

const pageRouteSearchParams = appRoutes.repo["detail"].search;

export default function DateFilter(props: IDateFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const openOverlay = React.useCallback(() => setIsOpen(true), [setIsOpen]);
    const closeOverlay = React.useCallback(() => setIsOpen(false), [setIsOpen]);

    const [selectedSprint, setSelectedSprint] = useState<SprintResponseDTO>();

    const [searchParams, setSearchParams] = useSearchParams();
    const startedAt = searchParams.get(pageRouteSearchParams.startedAt) ?? "";
    const endedAt = searchParams.get(pageRouteSearchParams.endedAt) ?? "";

    const startedAtDate = new Date(startedAt);
    const endedAtDate = new Date(endedAt);
    const isStillFilteringBySelectedSprint =
        selectedSprint &&
        startedAt &&
        endedAt &&
        new Date(selectedSprint?.start_date).toISOString() === startedAt &&
        new Date(selectedSprint?.end_date).toISOString() === endedAt;

    const isStartedAtAValidDate = startedAt && getIfDateIsValid(startedAtDate);
    const isEndedAtAValidDate = endedAt && getIfDateIsValid(endedAtDate);
    const isDateRangeValid =
        startedAt ||
        isStartedAtAValidDate ||
        endedAt ||
        isEndedAtAValidDate ||
        getIfDateRangeIsValid(startedAtDate, endedAtDate);

    function handleDateFilterFormSubmit(startedAt: string, endedAt: string) {
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(
                pageRouteSearchParams.startedAt,
                startedAt ? new Date(startedAt).toISOString() : ""
            );
            previousSearchParams.set(
                pageRouteSearchParams.endedAt,
                endedAt ? new Date(endedAt).toISOString() : ""
            );

            return previousSearchParams;
        });
        setSelectedSprint(undefined);
        closeOverlay();
    }

    function handleSprintChange(sprint: SprintResponseDTO | undefined) {
        setSelectedSprint(sprint);
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(
                pageRouteSearchParams.startedAt,
                sprint ? new Date(sprint.start_date).toISOString() : ""
            );
            previousSearchParams.set(
                pageRouteSearchParams.endedAt,
                sprint ? new Date(sprint.end_date).toISOString() : ""
            );

            return previousSearchParams;
        });
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                gap: 4,
                flexWrap: "wrap",
            }}
        >
            <AnchoredOverlay
                open={isOpen}
                onOpen={openOverlay}
                onClose={closeOverlay}
                renderAnchor={(anchorProps) => (
                    <Box
                        sx={{
                            fontWeight: "bold",
                            fontSize: 20,
                            fontStyle: "italic",
                            textDecoration: "underline",
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                            ":hover": {
                                opacity: 0.8,
                            },
                        }}
                        {...anchorProps}
                    >
                        <Octicon
                            icon={FilterIcon}
                            aria-label={undefined}
                            aria-labelledby="filtro"
                            sx={{ mr: 2, mb: 1 }}
                        />
                        {formatDateRange(startedAtDate, endedAtDate)}
                    </Box>
                )}
            >
                <DateFilterForm
                    onSubmit={handleDateFilterFormSubmit}
                    defaultStartedAtDate={
                        isDateRangeValid && isStartedAtAValidDate
                            ? startedAtDate
                            : undefined
                    }
                    defaultEndedAtDate={
                        isDateRangeValid && isEndedAtAValidDate
                            ? endedAtDate
                            : undefined
                    }
                />
            </AnchoredOverlay>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <SprintFilter
                    evaluationMethodId={props.evaluationMethodId}
                    onSelectedSprintSelect={handleSprintChange}
                    selectedSprint={
                        isStillFilteringBySelectedSprint
                            ? selectedSprint
                            : undefined
                    }
                />
                {props.children}
            </Box>
        </Box>
    );
}
