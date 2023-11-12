import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import { ValidationType } from "../../model/ConsistencyRule";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "consistency_rule",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            evaluationMethodId: {
                field: "evaluation_method_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "evaluation_method",
                    key: "id",
                },
            },
            sprintId: {
                field: "sprint_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "sprint",
                    key: "id",
                },
            },
            standardizedIssueId: {
                field: "standardized_issue_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: "standardized_issue",
                    key: "id",
                },
            },
            description: {
                field: "description",
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            filePath: {
                field: "file_path",
                type: DataTypes.STRING(10000),
                allowNull: false,
            },
            validationType: {
                field: "validation_type",
                type: DataTypes.ENUM(
                    ValidationType.DEFAULT,
                    ValidationType.CFF
                ),
                defaultValue: ValidationType.DEFAULT,
                allowNull: false,
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("consistency_rule");
};
