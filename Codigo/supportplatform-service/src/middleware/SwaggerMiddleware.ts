import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

const STATIC_PATH = "src/swagger";
const SWAGGER_JSON = "/swagger.json";

export default function applySwaggerMiddleware(app: Express) {
    app.use(express.static(STATIC_PATH));
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: SWAGGER_JSON,
            },
        })
    );
}
