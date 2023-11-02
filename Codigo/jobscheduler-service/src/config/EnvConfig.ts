import * as dotenv from "dotenv";
import path from "path";

type EnvConfigType = {
    APP_DEBUG: boolean;
    NODE_ENV: string | undefined;
    APP_TIMEZONE: string | undefined;
    DB_HOST: string | undefined;
    DB_USER: string | undefined;
    DB_PASSWORD: string | undefined;
    DB_NAME: string | undefined;
    DB_PORT: number | undefined;
    DB_DIALECT: string | undefined;
    DB_CHARSET: string | undefined;
    DB_COLLATE: string | undefined;
    DB_TIMEZONE: string | undefined;
    SYNC_TIME: string | undefined;
    GITHUB_PERSONAL_ACCESS_TOKEN: string | undefined;
    GITHUB_ORGANIZATION_NAME: string | undefined;
    TELEGRAM_BOT_TOKEN: string | undefined;
    TELEGRAM_CHAT_ID: string | undefined;
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
            APP_DEBUG: process.env.APP_DEBUG === "true",
            NODE_ENV: process.env.NODE_ENV,
            APP_TIMEZONE: process.env.APP_TIMEZONE,
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_NAME: process.env.DB_NAME,
            DB_PORT: Number(process.env.DB_PORT),
            DB_DIALECT: process.env.DB_DIALECT,
            DB_CHARSET: process.env.DB_CHARSET,
            DB_COLLATE: process.env.DB_COLLATE,
            DB_TIMEZONE: process.env.DB_TIMEZONE,
            SYNC_TIME: process.env.SYNC_TIME,
            GITHUB_PERSONAL_ACCESS_TOKEN:
                process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
            GITHUB_ORGANIZATION_NAME: process.env.GITHUB_ORGANIZATION_NAME,
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
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
    console.log("Environment Config:", EnvConfig, "\n");
}

export default EnvConfig;
