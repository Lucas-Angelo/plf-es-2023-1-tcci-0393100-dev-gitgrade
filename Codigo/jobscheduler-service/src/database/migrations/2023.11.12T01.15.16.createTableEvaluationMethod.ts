import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "evaluation_method",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            description: {
                field: "description",
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            semester: {
                field: "semester",
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            year: {
                field: "year",
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            disabledAt: {
                field: "disabled_at",
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("evaluation_method");
};
