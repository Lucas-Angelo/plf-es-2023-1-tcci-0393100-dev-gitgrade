import { ValidationError as SequelizeValidationError } from "sequelize";

export default class AppError extends Error {
    statusCode: number;
    error: unknown;

    constructor(message: string, statusCode = 500, error?: unknown) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        // if its a Sequelize's ValidationError, converts to AppError
        if (error instanceof SequelizeValidationError) {
            this.message = error.message.replace("Validation error: ", "");
            this.statusCode = 422;
            this.error = "Validation Error do Sequelize";
        }
        // if already is an appError, throw itself
        else if (error instanceof AppError) {
            this.message = error.message;
            this.statusCode = error.statusCode;
            this.error = error.error;
        } else {
            this.statusCode = statusCode;
            this.error = error;
        }
    }
}
