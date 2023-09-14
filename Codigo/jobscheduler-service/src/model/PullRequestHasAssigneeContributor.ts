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
                        model: PullRequest,
                        key: "id",
                    },
                },
                assigneeContributorId: {
                    field: "assignee_contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: Contributor,
                        key: "id",
                    },
                },
            },
            {
                tableName: "pr_assignees",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
                indexes: [
                    {
                        unique: true,
                        name: "pr_assignee_unique",
                        fields: ["pull_request_id", "assignee_contributor_id"],
                    },
                ],
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
