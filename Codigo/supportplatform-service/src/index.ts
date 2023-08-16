import express from 'express';
import { RegisterRoutes } from './swagger/routes';

import swaggerUi from "swagger-ui-express";
import Database from './database';

const app = express();

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

const database = new Database();
database.connect().catch(database.disconnect);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
