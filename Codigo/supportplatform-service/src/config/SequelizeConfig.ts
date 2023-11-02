import { Options } from "sequelize";
import EnvConfig from "./EnvConfig";
import logger from "./LogConfig";

type LoggingFunction = (message: string) => void;

const logging: LoggingFunction | false = EnvConfig.APP_DEBUG
    ? (message: string) => {
          logger.debug(message);
      }
    : false;

// Common options used for all environments
const commonOptions: Options = {
    host: EnvConfig.DB_HOST || "error",
    port: EnvConfig.DB_PORT || 0,
    dialect: EnvConfig.DB_DIALECT == "mysql" ? "mysql" : "sqlite",
    logging: logging,
    dialectOptions: {
        charset: EnvConfig.DB_CHARSET,
        connectTimeout: 60000,
        supportBigNumbers: true,
        bigNumberStrings: true,
        debug: false,
    },
    define: {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        collate: EnvConfig.DB_COLLATE,
    },
    sync: {
        alter: false,
        force: false,
    },
    timezone: EnvConfig.DB_TIMEZONE,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
        evict: 1000,
    },
    retry: {
        max: 10,
        timeout: 600000,
    },
};

const developtmentOptions: Options = {
    ...commonOptions,
    retry: {
        max: 20,
        timeout: 600000,
    },
};

const testOptions: Options = {
    ...commonOptions,
    retry: {
        max: 20,
        timeout: 600000,
    },
};

const productionOptions: Options = {
    ...commonOptions,
    retry: {
        max: 20,
        timeout: 600000,
    },
};

let SequelizeOptions: Options = commonOptions;
if (EnvConfig.NODE_ENV === "development")
    SequelizeOptions = developtmentOptions;
else if (EnvConfig.NODE_ENV === "test") SequelizeOptions = testOptions;
else if (EnvConfig.NODE_ENV === "production")
    SequelizeOptions = productionOptions;

export default SequelizeOptions;
