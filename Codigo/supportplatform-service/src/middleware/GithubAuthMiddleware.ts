import { Express, ErrorRequestHandler } from "express";
import passport from "passport";
import GitHubAuthenticationConfig, {
    AuthUser,
} from "../config/GitHubAuthenticationConfig";
import sessionConfig from "../config/SessionConfig";
import EnvConfig from "../config/EnvConfig";

export function applyGitHubAuthenticationMiddleware(app: Express) {
    const gitHubAuthenticationConfig = new GitHubAuthenticationConfig();
    app.use(sessionConfig);
    app.use(passport.initialize());
    app.use(passport.session());
    app.get(
        "/oauth/github",
        gitHubAuthenticationConfig.authenticateMiddleware()
    );
    app.get(
        "/oauth/github/callback",
        gitHubAuthenticationConfig.authenticateMiddleware(),
        (req, res) => {
            const exp_in_seconds = (req.user as AuthUser).expiresAt;
            res.cookie("token", (req.user as AuthUser).token, {
                expires: new Date(exp_in_seconds * 1000),
            });
            res.redirect(
                EnvConfig.OAUTH_SUCCESS_REDIRECT_URL ?? "http://localhost:3000"
            );
        }
    ).use(((err: Error, _req, res, _next) => {
        res.redirect(
            `${EnvConfig.OAUTH_SUCCESS_REDIRECT_URL}?${EnvConfig.OAUTH_FAILURE_SEARCH_PARAM}=${err.message}`
        );
    }) as ErrorRequestHandler);
}
