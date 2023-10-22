import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { EvaluationMethod } from "./EvaluationMethod";
import { Sprint } from "./Sprint";
import { StandardizedIssue } from "./StandardizedIssue";

enum ValidationType {
    DEFAULT = "DEFAULT",
    CFF = "CFF",
}

interface IConsistencyRuleAttributes {
    id?: number;
    evaluationMethodId: number;
    sprintId: number;
    standardizedIssueId?: number | null;
    description?: string | null;
    filePath: string;
    validationType: ValidationType;
}

class ConsistencyRule extends Model<IConsistencyRuleAttributes> {
    public id!: number;
    public evaluationMethodId!: number;
    public sprintId!: number;
    public standardizedIssueId!: number | null;
    public description!: string | null;
    public filePath!: string;
    public validationType!: "DEFAULT" | "CFF";

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
                sprintId: {
                    field: "sprint_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: Sprint,
                        key: "id",
                    },
                },
                standardizedIssueId: {
                    field: "standardized_issue_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: StandardizedIssue,
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
                    type: DataTypes.ENUM("DEFAULT", "CFF"),
                    defaultValue: "DEFAULT",
                    allowNull: false,
                },
            },
            {
                tableName: "consistency_rule",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        EvaluationMethod: typeof EvaluationMethod;
        Sprint: typeof Sprint;
        StandardizedIssue: typeof StandardizedIssue;
    }): void {
        this.belongsTo(models.EvaluationMethod, {
            foreignKey: "evaluationMethodId",
            as: "evaluationMethod",
        });

        this.belongsTo(models.Sprint, {
            foreignKey: "sprintId",
            as: "sprint",
        });

        this.belongsTo(models.StandardizedIssue, {
            foreignKey: "standardizedIssueId",
            as: "standardizedIssue",
        });
    }
}

export { ConsistencyRule, IConsistencyRuleAttributes, ValidationType };
