import { Model, DataTypes, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Repository } from "./Repository";

interface IContributorAttributes {
    id?: number;
    githubId?: string | null;
    githubLogin?: string | null;
    githubEmail?: string | null;
    githubName?: string | null;
    githubAvatarUrl?: string | null;
}

class Contributor extends Model<IContributorAttributes> {
    public id!: number;
    public githubId!: string;
    public githubLogin!: string;
    public githubEmail!: string;
    public githubName!: string | null;
    public githubAvatarUrl!: string | null;

    static initModel(sequelize: Sequelize): void {
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
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubLogin: {
                    field: "github_login",
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubEmail: {
                    field: "github_email",
                    type: DataTypes.STRING(200),
                    allowNull: true,
                    unique: true,
                },
                githubName: {
                    field: "github_name",
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                githubAvatarUrl: {
                    field: "github_avatar_url",
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                tableName: "contributor",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: { Repository: typeof Repository }): void {
        this.belongsToMany(models.Repository, {
            foreignKey: "contributorId",
            as: "repositories",
            through: "repository_has_contributor",
        });
    }
}

export { Contributor, IContributorAttributes };
