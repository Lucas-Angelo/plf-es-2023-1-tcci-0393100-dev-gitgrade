import { ErrorResponseDTO, EvaluationMethodCreateDTO } from "@gitgrade/dtos";

export class EvaluationMethodValidator {
    validate(formDataValues: {
        description: FormDataEntryValue | null;
        year: FormDataEntryValue | null;
        semester: FormDataEntryValue | null;
    }): Array<ErrorResponseDTO<keyof EvaluationMethodCreateDTO>["error"]> {
        const { description, year, semester } = formDataValues;
        const errors: Array<
            ErrorResponseDTO<keyof EvaluationMethodCreateDTO>["error"]
        > = [];

        if (!description) {
            errors.push({
                description: {
                    message: "Campo obrigatório",
                    value: description,
                },
            });
        } else if (String(description).length > 255) {
            errors.push({
                description: {
                    message: "Máximo de 255 caracteres",
                },
            });
        }

        if (!year) {
            errors.push({
                year: {
                    message: "Campo obrigatório",
                },
            });
        }

        if (!semester) {
            errors.push({
                semester: {
                    message: "Campo obrigatório",
                },
            });
        } else if (semester !== "1" && semester !== "2") {
            errors.push({
                semester: {
                    message: "Deve ser 1 ou 2",
                },
            });
        }

        return errors;
    }
}
