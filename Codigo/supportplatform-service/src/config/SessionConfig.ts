import session from "express-session";
import EnvConfig from "./EnvConfig";

const sessionConfig = session({
    secret: EnvConfig.SESSION_SECRET || "error_session_secret",
    name: "github-auth-session-cookie",
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
});

export default sessionConfig;
