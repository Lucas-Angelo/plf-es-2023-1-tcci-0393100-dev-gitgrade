import * as dotenv from "dotenv";
import path from "path";

class EnvironmentConfig {
    private envDirectory: string;
    private envFiles: { [key: string]: string };

    constructor() {
        this.envDirectory = path.join(path.resolve("."), "/env/");
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

    load() {
        // Load the base .env file
        dotenv.config({ path: path.join(this.envDirectory, ".env") });

        // Load other .env files defined by NODE_ENV
        const nodeEnv = process.env.NODE_ENV || "development";
        const envFile = this.envFiles[nodeEnv];
        if (envFile) {
            this.loadEnvFile(envFile);
        }
    }

    getAppConfig() {
        return {
            APP_DEBUG: process.env.APP_DEBUG === "true",
            NODE_ENV: process.env.NODE_ENV,
            APP_TIMEZONE: process.env.APP_TIMEZONE,
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_NAME: process.env.DB_NAME,
            DB_PORT: process.env.DB_PORT,
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
            SUPPORT_PLATFORM_URL: process.env.SUPPORT_PLATFORM_URL,
            PORT: process.env.PORT,
        };
    }

    enableTelegramAttachmentFix() {
        process.env.NTBA_FIX_350 = "1";
    }
}

const envConfig = new EnvironmentConfig();
envConfig.load();
envConfig.enableTelegramAttachmentFix();
const EnvConfig = envConfig.getAppConfig();

if (EnvConfig.APP_DEBUG) console.log("Environment Config:", EnvConfig, "\n");

export default EnvConfig;
