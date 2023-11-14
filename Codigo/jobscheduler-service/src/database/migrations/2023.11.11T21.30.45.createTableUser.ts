import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import { UserGithubOrganizationRoleEnum } from "../../model/User";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "user",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            githubId: {
                field: "github_id",
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: true,
            },
            githubLogin: {
                field: "github_login",
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            githubEmail: {
                field: "github_email",
                type: DataTypes.STRING(254),
                allowNull: true,
                unique: true,
            },
            githubOrganizationRole: {
                field: "github_organization_role",
                type: DataTypes.ENUM(
                    UserGithubOrganizationRoleEnum.ADMIN,
                    UserGithubOrganizationRoleEnum.MEMBER
                ),
                defaultValue: UserGithubOrganizationRoleEnum.MEMBER,
                allowNull: false,
            },
            githubName: {
                field: "github_name",
                type: DataTypes.STRING(1000),
                allowNull: true,
            },
            githubAvatarUrl: {
                field: "github_avatar_url",
                type: DataTypes.STRING(1000),
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
    await sequelize.getQueryInterface().dropTable("user");
};
