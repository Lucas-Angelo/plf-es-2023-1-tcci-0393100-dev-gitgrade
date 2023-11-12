import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable(
        "issue_assignees",
        {
            issueId: {
                field: "issue_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "issue",
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

    await queryInterface.addIndex("issue_assignees", {
        fields: ["issue_id", "assignee_contributor_id"],
        unique: true,
        name: "issue_assignee_unique",
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.removeIndex(
        "issue_assignees",
        "issue_assignee_unique"
    );
    await queryInterface.dropTable("issue_assignees");
};
