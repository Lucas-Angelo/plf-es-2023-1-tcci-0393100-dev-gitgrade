import EnvConfig from "./EnvConfig";
import logger from "./LogConfig";

type LoggingFunction = (message: string) => void;

const logging: LoggingFunction | false = EnvConfig.APP_DEBUG
    ? (message: string) => {
          logger.debug(message);
      }
    : false;

// Common options used for all environments
const commonOptions = {
    logging: logging,
    dialect: EnvConfig.DB_DIALECT,
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
    },
    retry: {
        max: 1, // Changed this value to 1 as mentioned in your code for the test environment
        timeout: 60000,
    },
};

// Configuration objects for each environment
const development = Object.assign(
    {},
    {
        username: EnvConfig.DB_USER,
        password: EnvConfig.DB_PASSWORD,
        database: EnvConfig.DB_NAME,
        options: commonOptions,
    }
);

const test = Object.assign({}, development, {
    options: Object.assign({}, commonOptions, {
        retry: {
            max: 3, // Changed this value to 3 for the test environment as mentioned in your code
            timeout: 60000,
        },
    }),
});

const production = Object.assign({}, development);

// Determine the config based on NODE_ENV
let SequelizeConfig:
    | typeof development
    | typeof test
    | typeof production
    | undefined;

if (EnvConfig.NODE_ENV === "development") SequelizeConfig = development;
else if (EnvConfig.NODE_ENV === "test") SequelizeConfig = test;
else if (EnvConfig.NODE_ENV === "production") SequelizeConfig = production;
else logger.error(`Invalid NODE_ENV: ${EnvConfig.NODE_ENV}`);

export default SequelizeConfig;
