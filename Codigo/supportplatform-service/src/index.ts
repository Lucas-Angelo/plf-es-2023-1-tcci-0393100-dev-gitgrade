import express from "express";
import cors from "cors";
import { RegisterRoutes } from "./swagger/routes";

import swaggerUi from "swagger-ui-express";
import AppError from "./error/AppError";
import { ValidateError } from "tsoa";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("src/swagger"));

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

RegisterRoutes(app);

app.use([
    (err, _request, response, _) => {
        if (err instanceof AppError) {
            // eslint-disable-next-line no-console
            console.log(err);
            return response.status(err.statusCode).json({
                message: err.message,
                error: err.error ?? err,
            });
        }

        if (err instanceof ValidateError) {
            // eslint-disable-next-line no-console
            console.log(err);
            return response.status(422).json({
                message: "Erro de validação",
                details: err?.fields,
            });
        }

        // Caso seja outro erro
        if (process.env.APP_DEBUG) {
            // eslint-disable-next-line no-console
            console.log(err);
            return response.status(500).json({
                error: err.error,
                message: err.message,
                stack: err.stack,
            });
        } else {
            return response.status(500).json({
                message: `Erro interno no servidor!`,
                error: err,
            });
        }
    },
]);

export default app;
