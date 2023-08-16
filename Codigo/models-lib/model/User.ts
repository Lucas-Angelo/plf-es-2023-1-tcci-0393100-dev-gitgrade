import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseConfig } from "../types/DatabaseConfig";

interface IUserAttributes {
    id?: number;
    githubId?: string;
    githubLogin?: string;
    githubEmail?: string | null;
    githubOrganizationRole?: string;
    githubName?: string | null;
    githubAvatarUrl?: string | null;
}

class User extends Model<IUserAttributes> {
    public id!: number;
    public githubId!: string;
    public githubLogin!: string;
    public githubEmail!: string | null;
    public githubOrganizationRole!: string;
    public githubName!: string | null;
    public githubAvatarUrl!: string | null;

    static initModel(sequelize: Sequelize, databaseConfig: DatabaseConfig): void {
        this.init(
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
                    validate: {
                        notEmpty: true,
                    },
                },
                githubLogin: {
                    field: "github_login",
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubEmail: {
                    field: "github_email",
                    type: DataTypes.STRING(254),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubOrganizationRole: {
                    field: "github_organization_role",
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
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
                tableName: "user",
                ...databaseConfig,
                sequelize,
            }
        );
    }
}

export { IUserAttributes, User };
