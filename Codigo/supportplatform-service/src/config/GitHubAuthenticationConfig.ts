import { Express } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github";
import EnvConfig from "../config/EnvConfig";
import { generateToken, verifyToken } from "../config/JwtConfig";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { IUserAttributes, UserGithubOrganizationRoleEnum } from "../model/User";
import { UserService } from "../service/UserService";
import { GitHubUserService } from "../service/client/GitHubUserService";

export interface AuthUser extends Express.User {
    token: string;
    expiresAt: number;
}

class GitHubAuthenticationConfig {
    private userService: UserService;
    private gitHubUserService: GitHubUserService;

    constructor() {
        this.userService = new UserService();
        this.gitHubUserService = new GitHubUserService();
        this.initialize();
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
        try {
            if (!profile.username) {
                return done(new AppError("No username provided", 400));
            }

            const isMember =
                await this.gitHubUserService.isUserMemberOfOrganization(
                    profile.username
                );

            if (!isMember) {
                return done(
                    new AppError(
                        "User is not a member of the organization",
                        403
                    )
                );
            }

            const isAdmin =
                await this.gitHubUserService.isUserAdminOfOrganization(
                    profile.username
                );

            if (!isAdmin) {
                return done(
                    new AppError(
                        "User is not an admin of the organization",
                        403
                    )
                );
            }

            const user: IUserAttributes = {
                githubId: profile.id,
                githubLogin: profile.username,
                githubEmail: profile.emails?.[0].value,
                githubName: profile.displayName,
                githubAvatarUrl: profile.photos?.[0].value,
                githubOrganizationRole: UserGithubOrganizationRoleEnum.ADMIN,
            };

            const persistedUser = await this.createOrUpdateUser(user);

            const authUser = generateToken(persistedUser.id) as AuthUser;
            return done(null, {
                token: authUser.token,
                expiresAt: authUser.expiresAt,
            });
        } catch (error: unknown) {
            logger.error("Error on authenticate", error);
            done(error as Error);
        }
    }

    private initialize() {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: EnvConfig.GITHUB_APP_CLIENT_ID || "",
                    clientSecret: EnvConfig.GITHUB_APP_CLIENT_SECRET || "",
                    callbackURL: `http://${EnvConfig.HOST}:${EnvConfig.PORT}/oauth/github/callback`,
                    scope: ["read:user", "user:email"],
                },
                this.authenticate.bind(this)
            )
        );

        passport.serializeUser((user: Express.User, done) => {
            if ("token" in user) {
                const authUser = user as AuthUser;
                logger.info("Serializing user", authUser);
                done(null, authUser);
            } else done(new AppError("User is not AuthUser", 500));
        });

        passport.deserializeUser(async (user: Express.User, done) => {
            if (!("token" in user))
                return done(new AppError("User is not AuthUser", 500));
            const token = (user as AuthUser).token;
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
                } else done(new AppError("Invalid token", 403));
            } catch (err) {
                done(new AppError("Error on deserialize user", 403, err));
            }
        });
    }

    public authenticateMiddleware() {
        return passport.authenticate("github", { failureRedirect: "/" });
    }
}

export default GitHubAuthenticationConfig;
