export function getTimeZoneAdjustedDate(dateString: string) {
    const dateSpecificString = dateString.substring(0, 10);
    const date = new Date(dateSpecificString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60 * 1000);
    return adjustedDate;
}

export function getIfDateIsValid(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function getIfDateRangeIsValid(startedAt: Date, endedAt: Date) {
    return startedAt <= endedAt;
}
