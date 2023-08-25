import cors from "cors";
import express from "express";
import { RegisterRoutes } from "./swagger/routes";

import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import AppError from "./error/AppError";

const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.get("origin");

    // TODO Add origin validation
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
    );

    // intercept OPTIONS method
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    } else {
        next();
    }
});

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
