import { ErrorResponseDTO, ConsistencyRuleCreateDTO } from "@gitgrade/dtos";
import { validationTypeArray } from "../enums/validationType";
import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";

export class ConsistencyRuleValidator {
    validate(formDataValues: {
        sprintId: FormDataEntryValue | null;
        standardizedIssueId: FormDataEntryValue | null;
        description: FormDataEntryValue | null;
        filePath: FormDataEntryValue | null;
        validationType: FormDataEntryValue | null;
    }): Array<ErrorResponseDTO<keyof ConsistencyRuleCreateDTO>["error"]> {
        const {
            description,
            filePath,
            sprintId,
            standardizedIssueId,
            validationType,
        } = formDataValues;
        const errors = [];

        if (description && String(description).length > 255) {
            errors.push({
                description: {
                    message: "Máximo de 255 caracteres",
                },
            });
        }

        if (!filePath) {
            errors.push({
                filePath: {
                    message: "Campo obrigatório",
                    value: filePath,
                },
            });
        } else if (filePath && String(filePath).length > 10000) {
            errors.push({
                filePath: {
                    message: "Máximo de 255 caracteres",
                },
            });
        }

        if (!sprintId) {
            errors.push({
                sprintId: {
                    message: "Campo obrigatório",
                    value: sprintId,
                },
            });
        } else if (Number.isNaN(Number(sprintId))) {
            errors.push({
                sprintId: {
                    message: "Deve ser um número",
                },
            });
        } else if (Number(sprintId) < 1) {
            errors.push({
                sprintId: {
                    message: "Deve ser maior que 0",
                },
            });
        }

        if (standardizedIssueId && Number.isNaN(Number(standardizedIssueId))) {
            errors.push({
                standardizedIssueId: {
                    message: "Deve ser um número",
                },
            });
        } else if (standardizedIssueId && Number(standardizedIssueId) < 1) {
            errors.push({
                standardizedIssueId: {
                    message: "Deve ser maior que 0",
                },
            });
        }

        if (!validationType) {
            errors.push({
                validationType: {
                    message: "Campo obrigatório",
                    value: validationType,
                },
            });
        } else if (
            !validationTypeArray.includes(
                String(validationType) as ValidationType
            )
        ) {
            errors.push({
                validationType: {
                    message: `Deve ser um dos valores: ${validationTypeArray.join(
                        ", "
                    )}`,
                },
            });
        }

        return errors;
    }
}
