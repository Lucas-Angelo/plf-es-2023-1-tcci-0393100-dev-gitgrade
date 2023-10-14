import { AnchoredOverlay, Box, IconButton } from "@primer/react";
import { FilterIcon } from "@primer/octicons-react";
import React, { useState } from "react";
import DateFilterForm from "../dateFilterForm";
import { useSearchParams } from "react-router-dom";
import {
    getIfDateRangeIsValid,
    getTimeZoneAdjustedDate,
    getIfDateIsValid,
} from "../../../../../../commom/utils/date";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IDateFilterProps {
    repositoryGithubCreatedAt?: Date;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export function formatDateRange(
    startedAt: Date | undefined,
    endedAt: Date | undefined,
    fallbackStartedAt: Date,
    fallbackEndedAt: Date
) {
    const isStartedAtAValidDate = startedAt && getIfDateIsValid(startedAt);
    const isEndedAtAValidDate = endedAt && getIfDateIsValid(endedAt);
    const isRangeValid =
        !startedAt ||
        !endedAt ||
        isStartedAtAValidDate ||
        isEndedAtAValidDate ||
        getIfDateRangeIsValid(startedAt, endedAt);
    const finalStartedAt =
        startedAt && getIfDateIsValid(startedAt) && isRangeValid
            ? startedAt
            : fallbackStartedAt;
    const finalEndedAt =
        endedAt && getIfDateIsValid(endedAt) && isRangeValid
            ? endedAt
            : fallbackEndedAt;

    return dateTimeFormat.formatRange(finalStartedAt, finalEndedAt);
}

const pageRouteSearchParams = appRoutes.repo["detail"].metrics.search;

export default function DateFilter(props: IDateFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const openOverlay = React.useCallback(() => setIsOpen(true), [setIsOpen]);
    const closeOverlay = React.useCallback(() => setIsOpen(false), [setIsOpen]);

    const [searchParams, setSearchParams] = useSearchParams();
    const startedAt = searchParams.get(pageRouteSearchParams.startedAt) ?? "";
    const endedAt = searchParams.get(pageRouteSearchParams.endedAt) ?? "";

    const startedAtDate = getTimeZoneAdjustedDate(startedAt);
    const endedAtDate = getTimeZoneAdjustedDate(endedAt);

    const isStartedAtAValidDate = startedAt && getIfDateIsValid(startedAtDate);
    const isEndedAtAValidDate = endedAt && getIfDateIsValid(endedAtDate);
    const isDateRangeValid =
        startedAt ||
        isStartedAtAValidDate ||
        endedAt ||
        isEndedAtAValidDate ||
        getIfDateRangeIsValid(startedAtDate, endedAtDate);

    const fallbackStartedAt = props.repositoryGithubCreatedAt
        ? new Date(props.repositoryGithubCreatedAt)
        : new Date("2008-11-15");
    const fallbackEndedAt = new Date();

    function handleDateFilterFormSubmit(startedAt: string, endedAt: string) {
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(
                pageRouteSearchParams.startedAt,
                startedAt
            );
            previousSearchParams.set(pageRouteSearchParams.endedAt, endedAt);

            return previousSearchParams;
        });
        closeOverlay();
    }

    return (
        <Box
            sx={{
                fontWeight: "bold",
                fontSize: 20,
                fontStyle: "italic",
                mb: 2,
            }}
        >
            {formatDateRange(
                startedAtDate,
                endedAtDate,
                fallbackStartedAt,
                fallbackEndedAt
            )}
            <AnchoredOverlay
                renderAnchor={(anchorProps) => (
                    <IconButton
                        icon={FilterIcon}
                        {...anchorProps}
                        aria-label={undefined}
                        aria-labelledby="filtro"
                        sx={{ ml: 2 }}
                    />
                )}
                open={isOpen}
                onOpen={openOverlay}
                onClose={closeOverlay}
            >
                <DateFilterForm
                    onSubmit={handleDateFilterFormSubmit}
                    defaultStartedAt={isDateRangeValid ? startedAt : undefined}
                    defaultEndedAt={isDateRangeValid ? endedAt : undefined}
                />
            </AnchoredOverlay>
        </Box>
    );
}
