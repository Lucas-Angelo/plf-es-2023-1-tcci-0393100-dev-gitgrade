import { Sequelize, Options } from "sequelize";
import MySqlDatabase from "./MySqlDatabase";

import SequelizeConfig from "../config/SequelizeConfig";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";

import { User } from "../model/User";
import { Repository } from "../model/Repository";
import { Contributor } from "../model/Contributor";
import { Issue } from "../model/Issue";
import { PullRequest } from "../model/PullRequest";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { File } from "../model/File";
import { RepositoryHasContributor } from "../model/RepositoryHasContributor";
import { IssueHasAssigneeContributor } from "../model/IssueHasAssigneeContributor";
import { PullRequestHasAssigneeContributor } from "../model/PullRequestHasAssigneeContributor";

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
        User.initModel(this.sequelize);
        Repository.initModel(this.sequelize);
        Contributor.initModel(this.sequelize);
        RepositoryHasContributor.initModel(this.sequelize);
        Issue.initModel(this.sequelize);
        IssueHasAssigneeContributor.initModel(this.sequelize);
        PullRequest.initModel(this.sequelize);
        PullRequestHasAssigneeContributor.initModel(this.sequelize);
        Branch.initModel(this.sequelize);
        Commit.initModel(this.sequelize);
        File.initModel(this.sequelize);
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
