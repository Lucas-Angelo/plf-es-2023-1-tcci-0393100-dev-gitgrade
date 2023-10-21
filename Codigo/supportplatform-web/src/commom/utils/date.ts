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

export function getDateToForm(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const yearString = year.toString();
    const monthString = month.toString().padStart(2, "0");
    const dayString = day.toString().padStart(2, "0");

    const hoursString = hours.toString().padStart(2, "0");
    const minutesString = minutes.toString().padStart(2, "0");

    return `${yearString}-${monthString}-${dayString}T${hoursString}:${minutesString}`;
}
