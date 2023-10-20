import { ErrorResponseDTO, StandardizedIssueCreateDTO } from "@gitgrade/dtos";

export class StandardizedIssueValidator {
    validate(formDataValues: {
        title: FormDataEntryValue | null;
        description: FormDataEntryValue | null;
    }): Array<ErrorResponseDTO<keyof StandardizedIssueCreateDTO>["error"]> {
        const { title, description } = formDataValues;
        const errors = [];

        if (!title) {
            errors.push({
                title: {
                    message: "Campo obrigatório",
                    value: title,
                },
            });
        } else if (title && String(title).length > 255) {
            errors.push({
                title: {
                    message: "Máximo de 255 caracteres",
                },
            });
        }

        if (!description) {
            errors.push({
                description: {
                    message: "Campo obrigatório",
                    value: description,
                },
            });
        }

        return errors;
    }
}
