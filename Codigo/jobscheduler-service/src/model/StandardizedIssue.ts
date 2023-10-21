import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { EvaluationMethod } from "./EvaluationMethod";

interface IStandardizedIssueAttributes {
    id?: number;
    evaluationMethodId: number;
    title: string;
    description?: string | null;
}

class StandardizedIssue extends Model<IStandardizedIssueAttributes> {
    public id!: number;
    public evaluationMethodId!: number;
    public title!: string;
    public description!: string | null;

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
                evaluationMethodId: {
                    field: "evaluation_method_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: EvaluationMethod,
                        key: "id",
                    },
                },
                title: {
                    field: "title",
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                description: {
                    field: "description",
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                tableName: "standardized_issue",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        EvaluationMethod: typeof EvaluationMethod;
    }): void {
        this.belongsTo(models.EvaluationMethod, {
            foreignKey: "evaluationMethodId",
            as: "evaluationMethod",
        });
    }
}

export { IStandardizedIssueAttributes, StandardizedIssue };
