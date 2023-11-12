import { Sequelize } from "sequelize";
import MySqlDatabase from "./MySqlDatabase";

import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";
import SequelizeOptions from "../config/SequelizeOptions";

import { Branch } from "../model/Branch";
import { CodeQuality } from "../model/CodeQuality";
import { Commit } from "../model/Commit";
import { ConsistencyRule } from "../model/ConsistencyRule";
import { ConsistencyRuleDelivery } from "../model/ConsistencyRuleDelivery";
import { Contributor } from "../model/Contributor";
import { EvaluationMethod } from "../model/EvaluationMethod";
import { File } from "../model/File";
import { Issue } from "../model/Issue";
import { IssueHasAssigneeContributor } from "../model/IssueHasAssigneeContributor";
import { PullRequest } from "../model/PullRequest";
import { PullRequestHasAssigneeContributor } from "../model/PullRequestHasAssigneeContributor";
import { Repository } from "../model/Repository";
import { RepositoryHasContributor } from "../model/RepositoryHasContributor";
import { Sprint } from "../model/Sprint";
import { StandardizedIssue } from "../model/StandardizedIssue";
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
        try {
            User.initModel(this.sequelize);
            EvaluationMethod.initModel(this.sequelize);
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
            Sprint.initModel(this.sequelize);
            StandardizedIssue.initModel(this.sequelize);
            ConsistencyRule.initModel(this.sequelize);
            ConsistencyRuleDelivery.initModel(this.sequelize);
            CodeQuality.initModel(this.sequelize);
        } catch (error) {
            logger.error("Error initializing models:", error);
            throw error;
        }
    }

    private associateModels() {
        try {
            Branch.associate({ Repository, Commit });
            Contributor.associate({ Repository, Commit, Issue, PullRequest });
            RepositoryHasContributor.associate({ Contributor, Repository });
            Issue.associate({ Contributor, Repository });
            IssueHasAssigneeContributor.associate({ Contributor, Issue });
            PullRequest.associate({ Contributor, Repository });
            PullRequestHasAssigneeContributor.associate({
                Contributor,
                PullRequest,
            });
            Commit.associate({ Branch, Contributor, File });
            File.associate({ Commit });
            Repository.associate({
                Branch,
                Contributor,
                Issue,
                PullRequest,
                EvaluationMethod,
                ConsistencyRuleDelivery,
            });
            EvaluationMethod.associate({
                Repository,
                Sprint,
                ConsistencyRule,
                StandardizedIssue,
            });
            Sprint.associate({ EvaluationMethod });
            StandardizedIssue.associate({ EvaluationMethod });
            ConsistencyRule.associate({
                EvaluationMethod,
                Sprint,
                StandardizedIssue,
            });
            ConsistencyRuleDelivery.associate({
                ConsistencyRule,
                Repository,
            });
            CodeQuality.associate({ Repository });
        } catch (error) {
            logger.error("Error associating models:", error);
            throw error;
        }
    }

    async connect() {
        await MySqlDatabase.createDatabaseIfNotExists();

        try {
            this.initModels();
            this.associateModels();
            await this.sequelize.authenticate();
            // TODO: create migrations
            if (EnvConfig.NODE_ENV == "development")
                await this.sequelize.sync();
            this.logConnectionSuccess();
        } catch (error) {
            this.logConnectionError(error);
        }
    }

    async close() {
        await this.sequelize.close();
    }

    public getSequelizeInstance(): Sequelize {
        return this.sequelize;
    }
}

export default SequelizeDatabase;

const sequelizeDatabase = new SequelizeDatabase();
export const sequelize = sequelizeDatabase.getSequelizeInstance();
