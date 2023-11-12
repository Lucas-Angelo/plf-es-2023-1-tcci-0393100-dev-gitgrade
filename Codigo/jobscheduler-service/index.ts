import { Express } from "express";
import app from "./src/api";
import EnvConfig from "./src/config/EnvConfig";
import logger from "./src/config/LogConfig";
import { JobScheduler } from "./src/cron/JobScheduler";
import SequelizeDatabase from "./src/database/SequelizeDatabase";

class Database {
    private sequelizeDatabase: SequelizeDatabase;

    constructor() {
        this.sequelizeDatabase = new SequelizeDatabase();
    }

    async connect() {
        try {
            logger.info("Connecting to the database...");
            await this.sequelizeDatabase.connect();
            logger.info("Database connection established.");
        } catch (error) {
            logger.error("Error during database connection:", { error });
            throw error;
        }
    }
    async disconnect() {
        try {
            logger.info("Disconnecting from the database...");
            await this.sequelizeDatabase.close();
            logger.info("Database disconnected.");
        } catch (error) {
            logger.error("Error during database disconnection:", { error });
            throw error;
        }
    }
}

class ApplicationInitializer {
    private database: Database;
    private jobScheduler: JobScheduler;
    private app: Express;

    constructor() {
        this.database = new Database();
        this.jobScheduler = new JobScheduler();
        this.app = app;
    }

    async initializeApp() {
        try {
            logger.info("Initializing the application...");

            await this.database.connect();

            this.jobScheduler.start();
            this.app.listen(EnvConfig.PORT, () => {
                logger.info(`Server running on port ${EnvConfig.PORT}!`);
            });

            // The database disconnection is not called here because
            // the app should remain running for the scheduler to execute the tasks.
            // If you decide to close the app, make sure to disconnect from the database.

            logger.info("Application started with scheduler!");
        } catch (error) {
            logger.error("Error occurred during application initialization:", {
                error,
            });
            throw error;
        }
    }
}

async function startApp() {
    const appInitializer = new ApplicationInitializer();
    await appInitializer.initializeApp();
}

startApp();
