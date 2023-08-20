import { Sequelize } from "sequelize";
import MySqlDatabase from "./MySqlDatabase";

import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";

import SequelizeOptions from "../config/SequelizeOptions";
import { Branch } from "../model/Branch";
import { Commit } from "../model/Commit";
import { Contributor } from "../model/Contributor";
import { File } from "../model/File";
import { Issue } from "../model/Issue";
import { IssueHasAssigneeContributor } from "../model/IssueHasAssigneeContributor";
import { PullRequest } from "../model/PullRequest";
import { PullRequestHasAssigneeContributor } from "../model/PullRequestHasAssigneeContributor";
import { Repository } from "../model/Repository";
import { RepositoryHasContributor } from "../model/RepositoryHasContributor";
import { User } from "../model/User";

class SequelizeDatabase {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = this.initializeSequelize();
    }

    private initializeSequelize(): Sequelize {
        return new Sequelize(
            EnvConfig.DB_NAME || "error",
            EnvConfig.DB_USER || "error",
            EnvConfig.DB_PASSWORD || "error",
            SequelizeOptions
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
            `Unable to establish, check, or re-sync connection with '${EnvConfig.DB_HOST}:${EnvConfig.DB_PORT}/${EnvConfig.DB_NAME}' with user '${EnvConfig.DB_USER}' and password '${EnvConfig.DB_PASSWORD}.'`,
            { error }
        );
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
