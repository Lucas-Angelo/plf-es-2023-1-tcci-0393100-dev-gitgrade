import { ErrorResponseDTO, SprintCreateDTO } from "@gitgrade/dtos";
import { getIfDateIsValid, getIfDateRangeIsValid } from "../utils/date";

export class SprintValidator {
    validate(formDataValues: {
        name: FormDataEntryValue | null;
        start_date: FormDataEntryValue | null;
        end_date: FormDataEntryValue | null;
    }): Array<ErrorResponseDTO<keyof SprintCreateDTO>["error"]> {
        const { name, start_date, end_date } = formDataValues;
        const errors = [];

        if (!name) {
            errors.push({
                name: {
                    message: "Campo obrigatório",
                    value: name,
                },
            });
        } else if (name && name.length > 255) {
            errors.push({
                name: {
                    message: "Máximo de 255 caracteres",
                },
            });
        }

        let bothDatesAreValid = true;

        if (!start_date) {
            errors.push({
                start_date: {
                    message: "Campo obrigatório",
                },
            });
            bothDatesAreValid = false;
        } else if (getIfDateIsValid(new Date(String(start_date))) === false) {
            errors.push({
                start_date: {
                    message: "Data inválida",
                },
            });
            bothDatesAreValid = false;
        }

        if (!end_date) {
            errors.push({
                end_date: {
                    message: "Campo obrigatório",
                },
            });
            bothDatesAreValid = false;
        } else if (getIfDateIsValid(new Date(String(end_date))) === false) {
            errors.push({
                end_date: {
                    message: "Data inválida",
                },
            });
            bothDatesAreValid = false;
        }

        if (
            bothDatesAreValid &&
            getIfDateRangeIsValid(
                new Date(String(start_date)),
                new Date(String(end_date))
            ) === false
        ) {
            errors.push({
                end_date: {
                    message:
                        "Data de término deve ser posterior à data de início",
                },
            });
        }

        return errors;
    }
}
