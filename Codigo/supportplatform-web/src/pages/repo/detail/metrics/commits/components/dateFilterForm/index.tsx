import { Box, Button, FormControl, TextInput } from "@primer/react";
import { useRef, useState } from "react";
import {
    getIfDateIsValid,
    getIfDateRangeIsValid,
} from "../../../../../../../commom/utils/date";

interface IDateFilterFormProps {
    onSubmit?: (startedAt: string, endedAt: string) => void;
    defaultStartedAt?: string;
    defaultEndedAt?: string;
}

export default function DateFilterForm(props: IDateFilterFormProps) {
    const startedAtInputRef = useRef<HTMLInputElement>(null);
    const endedAtInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        startedAt: props.defaultStartedAt ?? "",
        endedAt: props.defaultEndedAt ?? "",
    });

    const [isDateRangeInvalid, setIsDateRangeInvalid] = useState(false);

    function handleDateFilterFormSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const { startedAt, endedAt } = formData;

        const startedAtDate = new Date(startedAt);
        const endedAtDate = new Date(endedAt);

        if (
            !getIfDateIsValid(startedAtDate) ||
            !getIfDateIsValid(endedAtDate) ||
            getIfDateRangeIsValid(startedAtDate, endedAtDate)
        ) {
            props.onSubmit?.(startedAt, endedAt);
        } else {
            setIsDateRangeInvalid(true);
        }
    }

    function handleCleanFilterButtonClick(
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();
        setFormData({ startedAt: "", endedAt: "" });
        props.onSubmit?.("", "");
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (isDateRangeInvalid) {
            setIsDateRangeInvalid(false);
        }

        // warrant that the input name is one of the expected
        if (
            event.target.name === "startedAt" ||
            event.target.name === "endedAt"
        ) {
            const editedInputName = event.target.name;

            const isStartedAt = editedInputName === "startedAt";
            const isEndedAt = editedInputName === "endedAt";

            const otherInputName = isStartedAt ? "endedAt" : "startedAt";

            const oldValue = formData[editedInputName];
            const editedInputValue = event.target.value;
            let otherInputValue = formData[otherInputName];

            const startedAtValue = isStartedAt
                ? event.target.value
                : formData.startedAt;
            const endedAtValue = isEndedAt
                ? event.target.value
                : formData.endedAt;
            const oldStartedAtValue = isStartedAt
                ? oldValue
                : formData.startedAt;
            const oldEndedAtValue = isEndedAt ? oldValue : formData.endedAt;

            const hadValidDateRangeBefore = getIfDateRangeIsValid(
                new Date(oldStartedAtValue),
                new Date(oldEndedAtValue)
            );
            const hasValidDateRangeNow = getIfDateRangeIsValid(
                new Date(startedAtValue),
                new Date(endedAtValue)
            );

            // remaneja a data do outro input para manter o intervalo de datas, se o novo intervalo for inválido e o anterior for válido
            if (
                otherInputValue &&
                editedInputName &&
                !hasValidDateRangeNow &&
                oldValue &&
                hadValidDateRangeBefore
            ) {
                const daysDiff =
                    Math.abs(
                        new Date(oldStartedAtValue).getTime() -
                            new Date(oldEndedAtValue).getTime()
                    ) /
                    (1000 * 60 * 60 * 24);
                otherInputValue = new Date(
                    new Date(editedInputValue).getTime() +
                        daysDiff *
                            (1000 * 60 * 60 * 24) *
                            (isStartedAt ? 1 : -1)
                )
                    .toISOString()
                    .split("T")[0];
            }

            setFormData({
                ...formData,
                [editedInputName]: editedInputValue,
                [otherInputName]: otherInputValue,
            });
        }
    }

    return (
        <Box sx={{ minWidth: 300, p: 3 }}>
            <form
                action=""
                onSubmit={handleDateFilterFormSubmit}
            >
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Data inicial</FormControl.Label>
                    <TextInput
                        onChange={handleInputChange}
                        validationStatus={
                            isDateRangeInvalid ? "error" : undefined
                        }
                        ref={startedAtInputRef}
                        name="startedAt"
                        type="date"
                        sx={{ width: "100%" }}
                        value={formData.startedAt}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Data final</FormControl.Label>
                    <TextInput
                        onChange={handleInputChange}
                        validationStatus={
                            isDateRangeInvalid ? "error" : undefined
                        }
                        ref={endedAtInputRef}
                        name="endedAt"
                        type="date"
                        sx={{ width: "100%" }}
                        value={formData.endedAt}
                    />
                    {isDateRangeInvalid && (
                        <FormControl.Validation variant="error">
                            O intervalo selecionado é inválido
                        </FormControl.Validation>
                    )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                        type="button"
                        onClick={handleCleanFilterButtonClick}
                        variant="danger"
                        sx={{ width: "50%" }}
                    >
                        Limpar
                    </Button>
                    <Button
                        type="submit"
                        sx={{ width: "50%" }}
                    >
                        Filtrar
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
