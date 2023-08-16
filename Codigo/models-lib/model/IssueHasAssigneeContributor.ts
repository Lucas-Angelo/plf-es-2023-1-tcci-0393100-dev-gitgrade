import { DataTypes, Model, Sequelize } from "sequelize";

import { Contributor } from "./Contributor";
import { Issue } from "./Issue";
import { DatabaseConfig } from "../types/DatabaseConfig";

class IssueHasAssigneeContributor extends Model {
    public issueId!: number;
    public assigneeContributorId!: number;

    static initModel(sequelize: Sequelize, databaseConfig: DatabaseConfig): void {
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
                ...databaseConfig,
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
