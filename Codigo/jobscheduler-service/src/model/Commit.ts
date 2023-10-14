import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Branch } from "./Branch";
import { Contributor } from "./Contributor";
import { File } from "./File";

interface ICommitAttributes {
    id?: number;
    branchId?: number;
    contributorId?: number | null;
    sha?: string;
    message?: string | null;
    committedDate?: Date;
}

class Commit extends Model<ICommitAttributes> {
    public id!: number;
    public branchId!: number;
    public contributorId!: number | null;
    public sha!: string;
    public message!: string | null;
    public committedDate!: Date;
    public branch!: Branch;
    public contributor!: Contributor | null;
    public files!: File[];

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
                branchId: {
                    field: "branch_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: Branch,
                        key: "id",
                    },
                },
                contributorId: {
                    field: "contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: Contributor,
                        key: "id",
                    },
                },
                sha: {
                    field: "sha",
                    type: DataTypes.STRING(250),
                    allowNull: false,
                    unique: false,
                    validate: {
                        notEmpty: true,
                    },
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
                    validate: {
                        notEmpty: true,
                    },
                },
            },
            {
                tableName: "commit",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
                indexes: [
                    {
                        name: "sha_branch_id_UNIQUE",
                        unique: true,
                        fields: ["branch_id", "sha"],
                    },
                ],
            }
        );
    }

    static associate(models: {
        Branch: typeof Branch;
        Contributor: typeof Contributor;
        File: typeof File;
    }): void {
        this.belongsTo(models.Branch, {
            foreignKey: "branchId",
            as: "branch",
        });
        this.belongsTo(models.Contributor, {
            foreignKey: "contributorId",
            as: "contributor",
        });
        this.hasMany(models.File, {
            foreignKey: "commitId",
            as: "files",
        });
        // CodeQuality association
    }
}

export { Commit, ICommitAttributes };
