import { Express } from "express";
import passport from "passport";
import GitHubAuthenticationConfig, {
    AuthUser,
} from "../config/GitHubAuthenticationConfig";
import sessionConfig from "../config/SessionConfig";

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
            res.json({ authentication: req.user as AuthUser });
        }
    );
}
