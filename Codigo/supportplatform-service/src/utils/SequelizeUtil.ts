/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, ModelAttributes, ModelAttributeColumnOptions } from "sequelize";

type ModelInstance<T extends Model<any, any>> = T extends Model<
    infer A,
    infer _
>
    ? A
    : never;

class SequelizeUtil {
    // Function to check if any fields with notNull: true or failing validate are missing in the data
    public getMissingFields<T extends Model<any, any>>(
        modelClass: new () => T, // Pass the model class instead of an instance
        data: Partial<ModelInstance<T>>
    ): string[] {
        const missingFields: string[] = [];

        // Use type assertion to access the getAttributes method
        const rawAttributes = (modelClass as any)[
            "getAttributes"
        ]() as ModelAttributes<ModelInstance<T>, ModelInstance<T>>;

        for (const fieldName in rawAttributes) {
            const fieldDefinition = rawAttributes[
                fieldName
            ] as ModelAttributeColumnOptions<ModelInstance<T>>;

            // Check for allowNull: false and validate properties
            if (!fieldDefinition.allowNull && data[fieldName] === null) {
                missingFields.push(fieldName);
            } else if (
                fieldDefinition.validate &&
                typeof fieldDefinition.validate === "object"
            ) {
                const validateFns = Object.values(fieldDefinition.validate);
                for (const validateFn of validateFns) {
                    if (
                        typeof validateFn === "function" &&
                        !validateFn(data[fieldName], data)
                    ) {
                        missingFields.push(fieldName);
                        break;
                    }
                }
            }
        }

        return missingFields;
    }
}

export { SequelizeUtil };
