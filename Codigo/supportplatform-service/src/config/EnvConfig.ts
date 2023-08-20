import * as dotenv from "dotenv";
import path from "path";

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

// eslint-disable-next-line no-console
if (EnvConfig.APP_DEBUG) console.log("Environment Config:", EnvConfig, "\n");

export default EnvConfig;
