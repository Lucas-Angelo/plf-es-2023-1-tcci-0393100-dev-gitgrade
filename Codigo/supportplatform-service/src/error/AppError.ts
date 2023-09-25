import { ValidationError as SequelizeValidationError } from "sequelize";

export default class AppError extends Error {
    statusCode: number;
    error: unknown;

    // Erro que chegou
    constructor(message: string, statusCode = 500, error?: unknown) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        // se for um ValidationError do Sequelize, converte para AppError
        if (error instanceof SequelizeValidationError) {
            this.message = error.message.replace("Validation error: ", "");
            this.statusCode = 422;
            this.error = "Validation Error do Sequelize";
        }
        // se ja for um appError, passa pra frente
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
