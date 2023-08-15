import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Contributor } from "./Contributor";
import { Issue } from "./Issue";

class IssueHasAssigneeContributor extends Model {
    public issueId!: number;
    public assigneeContributorId!: number;

    static initModel(sequelize: Sequelize): void {
        this.init(
            {
                issueId: {
                    field: "issue_id",
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
                tableName: "issue_has_assignee_contributor",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        Issue: typeof Issue;
        Contributor: typeof Contributor;
    }): void {
        this.belongsTo(models.Issue, {
            foreignKey: "issueId",
            as: "issue",
        });
        this.belongsTo(models.Contributor, {
            foreignKey: "assigneeContributorId",
            as: "assigneeContributor",
        });
    }
}

export { IssueHasAssigneeContributor };
