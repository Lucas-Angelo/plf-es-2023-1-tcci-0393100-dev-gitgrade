import { isValidDateInterval } from "../utils/date";
import AppError from "../error/AppError";

export class QueryIntervalValidator {
    validate(query: { startedAt?: Date; endedAt?: Date }) {
        if (
            query.startedAt &&
            query.endedAt &&
            !isValidDateInterval(query.startedAt, query.endedAt)
        ) {
            throw new AppError("Invalid date interval", 422, {
                "query.startedAt": {
                    message: "startedAt must be less than or equal to endedAt",
                    value: query.startedAt,
                },
                "query.endedAt": {
                    message:
                        "endedAt must be greater than or equal to startedAt",
                    value: query.endedAt,
                },
            });
        }
    }
}
