import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { Repository } from "./Repository";

interface IEvaluationMethodAttributes {
    id?: number;
    description?: string;
    semester?: number;
    year?: number;
    disabledAt?: Date | null;
}

class EvaluationMethod extends Model<IEvaluationMethodAttributes> {
    public id!: number;
    public description!: string;
    public semester!: number;
    public year!: number;
    public disabledAt!: Date | null;

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
                description: {
                    field: "description",
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
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
                tableName: "evaluation_method",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                paranoid: true,
                timestamps: true,
                deletedAt: "disabledAt",
                createdAt: false,
                updatedAt: false,
                sequelize,
            }
        );
    }

    static associate(models: { Repository: typeof Repository }): void {
        this.hasMany(models.Repository, {
            foreignKey: "evaluationMethodId",
            as: "repositories",
        });
        // Sprint association
        // ConsistenceRule association
        // StandardizedIssue association
    }
}

export { EvaluationMethod, IEvaluationMethodAttributes };
