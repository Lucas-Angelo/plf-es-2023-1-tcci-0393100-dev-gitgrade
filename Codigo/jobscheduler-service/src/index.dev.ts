import logger from "./config/LogConfig";
import SequelizeDatabase from "./database/SequelizeDatabase";
import { JobExecutor } from "./job/JobExecutor";

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
    private jobExecutor: JobExecutor;

    constructor() {
        this.database = new Database();
        this.jobExecutor = new JobExecutor();
    }

    async initializeApp() {
        try {
            logger.info("Initializing the application...");

            await this.database.connect();

            await this.jobExecutor.runFetchers();

            await this.database.disconnect();

            logger.info("Application finished with success!");
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
