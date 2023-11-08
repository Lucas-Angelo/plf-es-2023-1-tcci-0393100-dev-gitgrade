import * as express from "express";
import logger from "../config/LogConfig";
import { verifyToken } from "../config/JwtConfig";
import { SupportPlatformAuthService } from "../service/client/SupportPlatformAuthService";
import AppError from "../error/AppError";

export async function expressAuthentication(
    request: express.Request,
    securityName: string,

    scopes?: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    logger.info("Authenticating request", { securityName, scopes });

    if (securityName === "bearer") {
        const authorizationHeader = request.headers["authorization"];

        if (!authorizationHeader) {
            logger.error("No authorization header provided");
            throw new AppError("No authorization header provided", 401);
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            logger.error("Invalid authorization header");
            throw new AppError("Invalid authorization header", 401);
        }

        const token = authorizationHeader.split(" ")[1];
        logger.info("Token extracted from authorization header");

        try {
            const apiPublicKey =
                await new SupportPlatformAuthService().getPublicKey();
            logger.info(
                "Authentication Public Key extracted from fetching Support Platform API "
            );
            const decoded = verifyToken(token, apiPublicKey);
            logger.info("Token successfully verified", decoded);
            return decoded;
        } catch (error) {
            if (error instanceof AppError) throw error;
            logger.error("Invalid token", error);
            throw new AppError("Invalid token", 401);
        }
    }

    logger.error("Invalid authentication type");
    throw new AppError("Invalid authentication type", 400);
}
