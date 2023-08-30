import { Express } from "express";
import { ValidateError } from "tsoa";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";
import AppError from "./AppError";

export default function applyErrorHandler(app: Express) {
    app.use([
        (err, _request, response, _) => {
            // Log the error and the request that caused it
            logger.error("Error: ", err);
            logger.error("Request: ", {
                method: _request.method,
                path: _request.path,
                body: _request.body,
            });

            // Handle AppError
            if (err instanceof AppError) {
                const responseBody = {
                    message: err.message,
                    error: err.error ?? err,
                };
                logger.error("Response: ", responseBody);

                if (err.message === "Deserialized user not found")
                    _request.session.destroy((error) => {
                        if (error)
                            logger.error("Error destroying session:", error);
                    });

                return response.status(err.statusCode).json(responseBody);
            }

            // Handle ValidateError
            if (err instanceof ValidateError) {
                const responseBody = {
                    message: "Validation Error",
                    error: err?.fields,
                };
                logger.error("Response: ", responseBody);
                return response.status(422).json(responseBody);
            }

            // Handle SyntaxError (e.g., JSON parsing error)
            if (err instanceof SyntaxError) {
                const responseBody = {
                    message: "Syntax Error",
                    error: err.message,
                };
                logger.error("Response: ", responseBody);
                return response.status(400).json(responseBody);
            }

            // Handle unknown error
            const responseBody = {
                message: `Internal Server Error!`,
                error: err.message,
                stack: EnvConfig.APP_DEBUG ? err.stack : undefined,
            };

            logger.error("Response: ", responseBody);
            return response.status(500).json(responseBody);

            logger.error("Response: ", responseBody);
            return response.status(500).json(responseBody);
        },
    ]);
}
