import { Sequelize, Options } from "sequelize";
import MySqlDatabase from "./MySqlDatabase";

import SequelizeConfig from "../config/SequelizeConfig";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";

import { 
    User, 
    Repository, 
    Contributor, 
    Issue, 
    PullRequest, 
    Branch, 
    Commit, 
    File, 
    RepositoryHasContributor, 
    IssueHasAssigneeContributor, 
    PullRequestHasAssigneeContributor, 
    DatabaseCaseConfig
} from "@gitgrade/models";

class SequelizeDatabase {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = this.initializeSequelize();
    }

    private initializeSequelize(): Sequelize {
        const defaultOptions: Options = {};
        const sequelizeOptions: Options = {
            ...defaultOptions,
            ...(SequelizeConfig?.options as Options),
        };

        return new Sequelize(
            SequelizeConfig?.database ?? "gitgrade",
            
            SequelizeConfig?.username ?? "root",
            SequelizeConfig?.password ?? "root",
            sequelizeOptions
        );
    }

    private logConnectionSuccess() {
        if (EnvConfig.APP_DEBUG && EnvConfig.NODE_ENV !== "test") {
            logger.info(
                `Connection with '${EnvConfig.DB_HOST}:${EnvConfig.DB_PORT}/${EnvConfig.DB_NAME}' established!`
            );
        }
    }

    private logConnectionError(error: unknown) {
        logger.error(
            `Unable to establish, check, or re-sync connection with '${EnvConfig.DB_HOST}:${EnvConfig.DB_PORT}/${EnvConfig.DB_NAME}' with user '${EnvConfig.DB_USER}' and password '${EnvConfig.DB_PASSWORD}.'`
        );
        logger.error(error);
        throw error;
    }

    private initModels() {
        const databaseCaseConfig: DatabaseCaseConfig = {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE
        }
        User.initModel(this.sequelize, databaseCaseConfig);
        Repository.initModel(this.sequelize, databaseCaseConfig);
        Contributor.initModel(this.sequelize, databaseCaseConfig);
        RepositoryHasContributor.initModel(this.sequelize, databaseCaseConfig);
        Issue.initModel(this.sequelize, databaseCaseConfig);
        IssueHasAssigneeContributor.initModel(this.sequelize, databaseCaseConfig);
        PullRequest.initModel(this.sequelize, databaseCaseConfig);
        PullRequestHasAssigneeContributor.initModel(this.sequelize, databaseCaseConfig);
        Branch.initModel(this.sequelize, databaseCaseConfig);
        Commit.initModel(this.sequelize, databaseCaseConfig);
        File.initModel(this.sequelize, databaseCaseConfig);
    }

    async connect() {
        await MySqlDatabase.createDatabaseIfNotExists();

        try {
            this.initModels();
            await this.sequelize.authenticate();
            this.logConnectionSuccess();
        } catch (error) {
            this.logConnectionError(error);
        }
    }

    async close() {
        await this.sequelize.close();
    }
}

export default SequelizeDatabase;
