import { AnchoredOverlay, Box, IconButton } from "@primer/react";
import { FilterIcon } from "@primer/octicons-react";
import React, { useState } from "react";
import DateFilterForm from "../dateFilterForm";
import { useSearchParams } from "react-router-dom";
import {
    getIfDateRangeIsValid,
    getTimeZoneAdjustedDate,
    getIfDateIsValid,
} from "../../../../../../../commom/utils/date";

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export function formatDateRange(
    startedAt: Date | undefined,
    endedAt: Date | undefined
) {
    if (
        startedAt &&
        getIfDateIsValid(startedAt) &&
        endedAt &&
        getIfDateIsValid(endedAt)
    )
        return dateTimeFormat.formatRange(startedAt, endedAt);

    let startedAtFormatted = "Início";
    if (startedAt && getIfDateIsValid(startedAt))
        startedAtFormatted = dateTimeFormat.format(startedAt);

    let endedAtFormatted = "Hoje";
    if (endedAt && getIfDateIsValid(endedAt))
        endedAtFormatted = dateTimeFormat.format(endedAt);

    return `${startedAtFormatted} - ${endedAtFormatted}`;
}

export default function DateFilter() {
    const [isOpen, setIsOpen] = useState(false);
    const openOverlay = React.useCallback(() => setIsOpen(true), [setIsOpen]);
    const closeOverlay = React.useCallback(() => setIsOpen(false), [setIsOpen]);

    const [searchParams, setSearchParams] = useSearchParams();
    const startedAt = searchParams.get("startedAt") ?? "";
    const endedAt = searchParams.get("endedAt") ?? "";

    const startedAtDate = getTimeZoneAdjustedDate(startedAt);
    const endedAtDate = getTimeZoneAdjustedDate(endedAt);

    const isDateRangeValid = getIfDateRangeIsValid(startedAtDate, endedAtDate);

    function handleDateFilterFormSubmit(startedAt: string, endedAt: string) {
        setSearchParams({ startedAt, endedAt });
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
            {!getIfDateIsValid(startedAtDate) ||
            !getIfDateIsValid(endedAtDate) ||
            isDateRangeValid
                ? formatDateRange(startedAtDate, endedAtDate)
                : formatDateRange(undefined, undefined)}
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
