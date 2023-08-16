import { Model, DataTypes, Sequelize } from "sequelize";

import { Contributor } from "./Contributor";
import { PullRequest } from "./PullRequest";
import { DatabaseConfig } from "../types/DatabaseConfig";

class PullRequestHasAssigneeContributor extends Model {
    public pullRequestId!: number;
    public assigneeContributorId!: number;

    static initModel(sequelize: Sequelize, databaseConfig: DatabaseConfig): void {
        this.init(
            {
                pullRequestId: {
                    field: "pull_request_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                assigneeContributorId: {
                    field: "assignee_contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
            },
            {
                tableName: "pull_request_has_assignee_contributor",
                ...databaseConfig,
                sequelize,
            }
        );
    }

    static associate(models: {
        PullRequest: typeof PullRequest;
        Contributor: typeof Contributor;
    }): void {
        this.belongsTo(models.PullRequest, {
            foreignKey: "pullRequestId",
            as: "pullRequest",
        });
        this.belongsTo(models.Contributor, {
            foreignKey: "assigneeContributorId",
            as: "assigneeContributor",
        });
    }
}

export { PullRequestHasAssigneeContributor };
