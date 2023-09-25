import cors from "cors";
import { Express } from "express";

const corsOptions = {
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
};

export default function applyCorsMiddleware(app: Express) {
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
}
