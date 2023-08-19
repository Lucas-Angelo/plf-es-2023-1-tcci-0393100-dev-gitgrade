import logger from "../config/LogConfig";
import SequelizeDatabase from "./SequelizeDatabase";

export default class Database {
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
            logger.error("Error during database connection:", error);
            throw error;
        }
    }
    async disconnect() {
        try {
            logger.info("Disconnecting from the database...");
            await this.sequelizeDatabase.close();
            logger.info("Database disconnected.");
        } catch (error) {
            logger.error("Error during database disconnection:", error);
            throw error;
        }
    }
}
