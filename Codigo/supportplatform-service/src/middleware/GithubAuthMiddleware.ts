import { Octokit } from "@octokit/rest";
import { Express } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github";
import EnvConfig from "../config/EnvConfig";
import { generateToken, verifyToken } from "../config/JwtConfig";
import logger from "../config/LogConfig";
import sessionConfig from "../config/SessionConfig";
import AppError from "../error/AppError";
import { IUserAttributes, UserGithubOrganizationRoleEnum } from "../model/User";
import { UserService } from "../service/UserService";

interface AuthUser extends Express.User {
    token: string;
}

class GithubAuth {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.initialize();
    }

    private async getOrganizations(token: string) {
        const octokitGitHubApi = new Octokit({
            auth: token,
        });

        const orgs = await octokitGitHubApi.request("GET /user/orgs");
        return orgs.data;
    }

    private async getUserDetails(token: string) {
        const octokitGitHubApi = new Octokit({
            auth: token,
        });

        const userDetails = await octokitGitHubApi.request("GET /user");
        const user: IUserAttributes = {
            githubId: userDetails.data.id.toString(),
            githubLogin: userDetails.data.login,
            githubEmail: userDetails.data.email,
            githubName: userDetails.data.name,
            githubAvatarUrl: userDetails.data.avatar_url,
        };

        return user;
    }

    private async getOrganizationMemberDetails(
        token: string,
        githubLogin: string
    ) {
        const octokitGitHubApi = new Octokit({
            auth: token,
        });

        const orgMemberDetails = await octokitGitHubApi.request(
            `GET /orgs/${EnvConfig.GITHUB_ORGANIZATION_NAME}/memberships/${githubLogin}`
        );

        return orgMemberDetails.data.role;
    }

    private async createOrUpdateUser(user: IUserAttributes) {
        return await this.userService.createOrUpdate(user);
    }

    private async authenticate(
        token: string,
        tokenSecret: string,
        profile: Profile,
        done: (
            error: Error | null,
            user?: AuthUser | false,
            info?: Record<string, unknown>
        ) => void
    ) {
        // Get user's organizations
        const orgs = await this.getOrganizations(token);
        const loopLessOrg = orgs.find(
            (org: { login: string }) =>
                org.login === EnvConfig.GITHUB_ORGANIZATION_NAME
        );

        logger.info("orgs", orgs);

        // Check if user is a member of the organization
        if (!loopLessOrg) return done(null, false);

        // Get user details
        const user = await this.getUserDetails(token);

        logger.info("User details", user);

        // Get the member's role in the organization
        user.githubOrganizationRole = await this.getOrganizationMemberDetails(
            token,
            user.githubLogin!
        );

        // Create or update the user
        const persistedUser = await this.createOrUpdateUser(user);

        if (
            persistedUser.githubOrganizationRole.toLocaleLowerCase() !==
            UserGithubOrganizationRoleEnum.ADMIN.toString().toLocaleLowerCase()
        )
            return done(
                new AppError("User is not an admin of the organization", 401)
            );

        // Generate token
        const jwtToken = generateToken(persistedUser.id);
        return done(null, { token: jwtToken } as AuthUser);
    }

    private initialize() {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: EnvConfig.GITHUB_APP_CLIENT_ID || "",
                    clientSecret: EnvConfig.GITHUB_APP_CLIENT_SECRET || "",
                    callbackURL: `http://${EnvConfig.HOST}:${EnvConfig.PORT}/oauth/github/callback`,
                    scope: ["read:user", "user:email", "read:org"],
                },
                this.authenticate.bind(this)
            )
        );

        passport.serializeUser((user: Express.User, done) => {
            if ("token" in user) {
                const authUser = user as AuthUser;
                done(null, authUser.token);
            } else done(new Error("User is not AuthUser"), 500);
        });

        passport.deserializeUser(async (token: string, done) => {
            try {
                const decoded = verifyToken(token);
                if (typeof decoded === "object" && "id" in decoded) {
                    const user = await this.userService.findOneByField(
                        "id",
                        decoded.id
                    );
                    if (!user)
                        return done(
                            new AppError("Deserialized user not found", 404)
                        );
                    done(null, user);
                } else done(new AppError("Invalid token", 401));
            } catch (err) {
                done(new AppError("Error on deserialize user", 401, err));
            }
        });
    }

    public authenticateMiddleware() {
        return passport.authenticate("github", { failureRedirect: "/" });
    }
}

export function applyGithubAuthMiddleware(app: Express) {
    const githubAuth = new GithubAuth();
    app.use(sessionConfig);
    app.use(passport.initialize());
    app.use(passport.session());
    app.get("/oauth/github", githubAuth.authenticateMiddleware());
    app.get(
        "/oauth/github/callback",
        githubAuth.authenticateMiddleware(),
        (req, res) => {
            res.json({ token: (req.user as AuthUser).token });
        }
    );
}
