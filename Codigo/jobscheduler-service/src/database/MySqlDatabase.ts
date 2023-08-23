import { Connection, createConnection } from "mysql2/promise";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";

interface ConnectionConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
}

class MySqlDatabase {
    private connectionConfig: ConnectionConfig;

    constructor() {
        this.connectionConfig = {
            host: EnvConfig.DB_HOST,
            port: parseInt(EnvConfig.DB_PORT ?? "3306"),
            user: EnvConfig.DB_USER,
            password: EnvConfig.DB_PASSWORD,
        };
    }

    private async getConnection(): Promise<Connection> {
        try {
            return await createConnection(this.connectionConfig);
        } catch (error) {
            logger.error("Error creating database connection:", { error });
            throw error;
        }
    }

    async createDatabaseIfNotExists(): Promise<void> {
        try {
            const connection: Connection = await this.getConnection();

            await connection.query(
                `CREATE DATABASE IF NOT EXISTS \`${EnvConfig.DB_NAME}\` CHARACTER SET \`${EnvConfig.DB_CHARSET}\` COLLATE \`${EnvConfig.DB_COLLATE}\`;`
            );

            await connection.end();
        } catch (error) {
            logger.error("Error creating database:", { error });
            throw error;
        }
    }

    async dropDatabase(): Promise<void> {
        try {
            const connection: Connection = await this.getConnection();

            await connection.query(
                `DROP DATABASE IF EXISTS \`${EnvConfig.DB_NAME}\``
            );

            await connection.end();
        } catch (error) {
            logger.error("Error dropping database:", { error });
            throw error;
        }
    }
}

export default new MySqlDatabase();
