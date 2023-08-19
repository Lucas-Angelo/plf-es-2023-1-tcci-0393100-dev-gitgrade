import { Octokit } from "@octokit/rest";
import EnvConfig from "./EnvConfig";
import logger from "./LogConfig";

import { RequestParameters } from "@octokit/types";

const RATE_LIMIT_STATUS = 403;

class GitHubApiConfig {
    private octokit: Octokit;

    constructor() {
        const octokitConfig = {
            auth: EnvConfig.GITHUB_PERSONAL_ACCESS_TOKEN,
            log: {
                debug: EnvConfig.APP_DEBUG
                    ? (message: string, ...args: unknown[]) =>
                          logger.debug(message, ...args)
                    : () => {},
                info: (message: string, ...args: unknown[]) =>
                    logger.info(message, ...args),
                warn: (message: string, ...args: unknown[]) =>
                    logger.warn(message, ...args),
                error: (message: string, ...args: unknown[]) =>
                    logger.error(message, ...args),
            },
            timeZone: EnvConfig.APP_TIMEZONE,
        };

        this.octokit = new Octokit(octokitConfig);
    }

    private async sleep(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    private async checkRateLimitAndSleep() {
        try {
            const response = await this.octokit.request("GET /rate_limit");
            const remaining = response.data.resources.core.remaining;
            const resetTime = new Date(
                response.data.resources.core.reset * 1000
            );
            const currentTime = new Date();
            logger.info(`Rate limit remaining: ${remaining} requests`);

            if (remaining === 0) {
                const sleepTime = resetTime.getTime() - currentTime.getTime();

                logger.warn(
                    `Rate limit reached. Waiting for ${sleepTime}ms... to reset time in ${resetTime}`
                );
                await this.sleep(sleepTime);
            }
        } catch (error) {
            if (
                error !== null &&
                typeof error === "object" &&
                "status" in error &&
                error.status === RATE_LIMIT_STATUS
            ) {
                const resetTime = new Date(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parseInt((error as any).headers["x-ratelimit-reset"]) * 1000
                );
                const currentTime = new Date();
                const sleepTime = resetTime.getTime() - currentTime.getTime();

                logger.warn(
                    `Rate limit reached. Waiting for ${sleepTime}ms... to reset time in ${resetTime}`
                );
                await this.sleep(sleepTime);
            } else {
                logger.error("Error while checking rate limit:", { error });
                throw error;
            }
        }
    }

    public async request(endpoint: string, options?: RequestParameters) {
        logger.info(`Requesting endpoint: ${endpoint} with options:`, {
            options,
        });
        await this.checkRateLimitAndSleep();
        return this.octokit.request(endpoint, options);
    }
}

const GitHubApi = new GitHubApiConfig();
export default GitHubApi;
