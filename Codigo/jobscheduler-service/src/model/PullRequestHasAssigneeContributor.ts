import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Contributor } from "./Contributor";
import { PullRequest } from "./PullRequest";

class PullRequestHasAssigneeContributor extends Model {
    public pullRequestId!: number;
    public assigneeContributorId!: number;

    static initModel(sequelize: Sequelize): void {
        this.init(
            {
                pullRequestId: {
                    field: "pull_request_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "pull_request",
                        key: "id",
                    },
                },
                assigneeContributorId: {
                    field: "assignee_contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "contributor",
                        key: "id",
                    },
                },
            },
            {
                tableName: "pull_request_has_assignee_contributor",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
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
