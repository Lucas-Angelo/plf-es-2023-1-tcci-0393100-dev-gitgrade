import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable(
        "pr_assignees",
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
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );

    await queryInterface.addIndex("pr_assignees", {
        fields: ["pull_request_id", "assignee_contributor_id"],
        unique: true,
        name: "pr_assignee_unique",
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.removeIndex("pr_assignees", "pr_assignee_unique");
    await queryInterface.dropTable("pr_assignees");
};
