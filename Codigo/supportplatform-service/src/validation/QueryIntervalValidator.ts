import { ErrorResponseDTO } from "@gitgrade/dtos";
import { TsoaResponse } from "tsoa";
import { isValidDateInterval } from "../utils/date";

export class QueryIntervalValidator {
    unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>;

    constructor(
        unprocessableEntityResponse: TsoaResponse<422, ErrorResponseDTO>
    ) {
        this.unprocessableEntityResponse = unprocessableEntityResponse;
    }

    validate(query: { startedAt?: Date; endedAt?: Date }) {
        if (
            query.startedAt &&
            query.endedAt &&
            !isValidDateInterval(query.startedAt, query.endedAt)
        ) {
            return this.unprocessableEntityResponse(422, {
                message: "Invalid date interval",
                error: {
                    "query.startedAt": {
                        message:
                            "startedAt must be less than or equal to endedAt",
                        value: query.startedAt,
                    },
                    "query.endedAt": {
                        message:
                            "endedAt must be greater than or equal to startedAt",
                        value: query.endedAt,
                    },
                },
            });
        }
    }
}
