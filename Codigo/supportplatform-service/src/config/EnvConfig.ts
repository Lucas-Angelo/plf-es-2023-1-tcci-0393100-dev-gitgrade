import * as dotenv from "dotenv";
import path from "path";

type EnvConfigType = {
    NODE_ENV: string | undefined;
    APP_TIMEZONE: string | undefined;
    DB_DIALECT: string | undefined;
    DB_CHARSET: string | undefined;
    DB_COLLATE: string | undefined;
    DB_TIMEZONE: string | undefined;
    HOST: string | undefined;
    PORT: number | undefined;
    APP_DEBUG: boolean | undefined;
    DB_HOST: string | undefined;
    DB_USER: string | undefined;
    DB_PASSWORD: string | undefined;
    DB_NAME: string | undefined;
    DB_PORT: number | undefined;
    GITHUB_ORGANIZATION_NAME: string | undefined;
    GITHUB_APP_CLIENT_ID: string | undefined;
    GITHUB_APP_CLIENT_SECRET: string | undefined;
    GITHUB_PERSONAL_ACCESS_TOKEN: string | undefined;
    JWT_PUBLIC_KEY: string;
    JWT_PRIVATE_KEY: string;
    JOB_SCHEDULER_API_URL: string | undefined;
    SESSION_SECRET: string | undefined;
    OAUTH_SUCCESS_REDIRECT_URL: string | undefined;
    OAUTH_FAILURE_SEARCH_PARAM: string | undefined;
    SONARQUBE_HOST: string | undefined;
    SONARQUBE_PORT: number | undefined;
    SONARQUBE_DOCKER_PORT: number | undefined;
    SONARQUBE_ADMIN_USERNAME: string | undefined;
    SONARQUBE_ADMIN_PASSWORD: string | undefined;
};

class EnvironmentConfig {
    private envDirectory: string;
    private envFiles: { [key: string]: string };

    constructor() {
        this.envDirectory = path.join(path.resolve("."), "/env/");
        // eslint-disable-next-line no-console
        console.log("\nCurrent environment directory:", this.envDirectory);

        this.envFiles = {
            development: ".env.development",
            test: ".env.test",
            production: ".env.production",
        };
    }

    private loadEnvFile(envFile: string) {
        dotenv.config({ path: path.join(this.envDirectory, envFile) });
    }

    private load() {
        dotenv.config({ path: path.join(this.envDirectory, ".env") });

        const nodeEnv = process.env.NODE_ENV || "development";
        const envFile = this.envFiles[nodeEnv];
        if (envFile) {
            this.loadEnvFile(envFile);
        }
    }

    private enableTelegramAttachmentFix() {
        process.env.NTBA_FIX_350 = "1";
    }

    private getAppConfig(): EnvConfigType {
        return {
            NODE_ENV: process.env.NODE_ENV,
            APP_TIMEZONE: process.env.APP_TIMEZONE,
            DB_DIALECT: process.env.DB_DIALECT,
            DB_CHARSET: process.env.DB_CHARSET,
            DB_COLLATE: process.env.DB_COLLATE,
            DB_TIMEZONE: process.env.DB_TIMEZONE,
            HOST: process.env.HOST,
            PORT: Number(process.env.PORT),
            APP_DEBUG: process.env.APP_DEBUG === "true",
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_NAME: process.env.DB_NAME,
            DB_PORT: Number(process.env.DB_PORT),
            GITHUB_ORGANIZATION_NAME: process.env.GITHUB_ORGANIZATION_NAME,
            GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
            GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
            JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY ?? "",
            JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ?? "",
            JOB_SCHEDULER_API_URL: process.env.JOB_SCHEDULER_API_URL,
            GITHUB_PERSONAL_ACCESS_TOKEN:
                process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
            SESSION_SECRET: process.env.SESSION_SECRET,
            OAUTH_SUCCESS_REDIRECT_URL: process.env.OAUTH_SUCCESS_REDIRECT_URL,
            OAUTH_FAILURE_SEARCH_PARAM: process.env.OAUTH_FAILURE_SEARCH_PARAM,
            SONARQUBE_HOST: process.env.SONARQUBE_HOST,
            SONARQUBE_PORT: Number(process.env.SONARQUBE_PORT),
            SONARQUBE_DOCKER_PORT: Number(process.env.SONARQUBE_DOCKER_PORT),
            SONARQUBE_ADMIN_USERNAME: process.env.SONARQUBE_ADMIN_USERNAME,
            SONARQUBE_ADMIN_PASSWORD: process.env.SONARQUBE_ADMIN_PASSWORD,
        };
    }

    private validateConfig(config: EnvConfigType) {
        for (const [key, value] of Object.entries(config)) {
            if (value === undefined) {
                throw new Error(`Environment variable ${key} is missing!`);
            }
        }
    }

    public getConfig(): EnvConfigType {
        this.load();
        this.enableTelegramAttachmentFix();
        const config = this.getAppConfig();
        this.validateConfig(config);
        return config;
    }
}

const envConfig = new EnvironmentConfig();
const EnvConfig = envConfig.getConfig();

if (EnvConfig.APP_DEBUG) {
    // eslint-disable-next-line no-console
    console.log("Environment Config:", EnvConfig, "\n");
}

export default EnvConfig;
