import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "branch",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            repositoryId: {
                field: "repository_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "repository",
                    key: "id",
                },
            },
            name: {
                field: "name",
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            commitAutomaticSynchronization: {
                field: "commit_automatic_synchronization",
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            fileAutomaticSynchronization: {
                field: "file_automatic_synchronization",
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );

    await sequelize.getQueryInterface().addIndex("branch", {
        fields: ["repository_id", "name"],
        unique: true,
        name: "branch_repository_id_name_UNIQUE",
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize
        .getQueryInterface()
        .removeIndex("branch", "branch_repository_id_name_UNIQUE");
    await sequelize.getQueryInterface().dropTable("branch");
};
