import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "commit",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            branchId: {
                field: "branch_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "branch",
                    key: "id",
                },
            },
            contributorId: {
                field: "contributor_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: "contributor",
                    key: "id",
                },
            },
            sha: {
                field: "sha",
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            message: {
                field: "message",
                type: DataTypes.TEXT,
                allowNull: true,
            },
            committedDate: {
                field: "committed_date",
                type: DataTypes.DATE,
                allowNull: false,
            },
            possiblyAffectedByForcePush: {
                field: "possibly_affected_by_force_push",
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

    await sequelize.getQueryInterface().addIndex("commit", {
        fields: ["branch_id", "sha"],
        unique: true,
        name: "sha_branch_id_UNIQUE",
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize
        .getQueryInterface()
        .removeIndex("commit", "sha_branch_id_UNIQUE");
    await sequelize.getQueryInterface().dropTable("commit");
};
