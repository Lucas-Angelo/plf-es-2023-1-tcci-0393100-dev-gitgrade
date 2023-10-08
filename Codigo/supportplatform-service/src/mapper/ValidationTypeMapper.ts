import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";
import AppError from "../error/AppError";

export class ValidationTypeMapper {
    toDto(validationTypeStringFromModel: string): ValidationType {
        if (!(validationTypeStringFromModel in ValidationType)) {
            throw new AppError(
                `Unknown validation type: ${validationTypeStringFromModel}`,
                500
            );
        }
        return ValidationType[
            validationTypeStringFromModel as keyof typeof ValidationType
        ];
    }
}
