import EnvConfig from "../config/EnvConfig";

export function isValidDateInterval(startedAt: Date, endedAt: Date) {
    return startedAt <= endedAt;
}

export function getDateInDayStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDateInDayEnd(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
    );
}

export function getDateInServerTimeZone(date: Date) {
    const serverTimeZone = EnvConfig.DB_TIMEZONE ?? "-03:00";
    const [timeZoneHours, timeZoneMinutes] = serverTimeZone
        .split(":")
        .map((part) => Number(part));

    const serverTimeZoneOffset =
        (Math.abs(timeZoneHours) * 60 + timeZoneMinutes) *
        (timeZoneHours < 0 ? 1 : -1);

    const dateInServerTimeZone = new Date(date);
    dateInServerTimeZone.setMinutes(
        dateInServerTimeZone.getMinutes() + serverTimeZoneOffset
    );

    return dateInServerTimeZone;
}
