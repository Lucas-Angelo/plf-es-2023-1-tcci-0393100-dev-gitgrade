import express, { Express } from "express";
import applyErrorHandler from "../error/ErrorHandler";
import applyCorsMiddleware from "../middleware/CorsMiddleware";
import applySwaggerMiddleware from "../middleware/SwaggerMiddleware";
import { RegisterRoutes } from "../swagger/routes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Need be the first middleware because this allow requests
applyCorsMiddleware(app);

// Need be the third middleware because this will generate routes with authorization
applySwaggerMiddleware(app);

// Register be the last middleware because this will register routes
RegisterRoutes(app);

// Apply error handler middleware to catch all errors and send to client
applyErrorHandler(app);

export default app;
