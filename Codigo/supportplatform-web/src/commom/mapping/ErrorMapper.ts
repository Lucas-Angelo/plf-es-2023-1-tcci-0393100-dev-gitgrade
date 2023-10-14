import { ErrorResponseDTO } from "@gitgrade/dtos";

type ErrorPrefix = "body" | "query" | "params";

export default class ErrorMapper {
    map<TPrefix extends ErrorPrefix, TAttributtes extends string>(
        errorDataResponse: ErrorResponseDTO<`${TPrefix}.${TAttributtes}`>,
        prefix: TPrefix
    ): ErrorResponseDTO<TAttributtes> {
        const newError: ErrorResponseDTO<TAttributtes> = {
            message: errorDataResponse.message,
            error: undefined,
        };

        if (errorDataResponse.error) {
            newError.error = Object.entries(errorDataResponse.error).reduce(
                (acc, entry) => {
                    const [key, value] = entry as [
                        `${TPrefix}.${TAttributtes}`,
                        string
                    ];
                    if (!key.startsWith(prefix)) return acc;
                    const newKey = key.replace(
                        `${prefix}.`,
                        ""
                    ) as TAttributtes;
                    return {
                        ...acc,
                        [newKey]: value,
                    };
                },
                {} as ErrorResponseDTO<TAttributtes>["error"]
            );
        }

        return newError;
    }
}
