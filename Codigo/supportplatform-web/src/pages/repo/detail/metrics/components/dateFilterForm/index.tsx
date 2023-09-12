import { Box, Button, FormControl, TextInput } from "@primer/react";
import { useRef, useState } from "react";
import {
    getIfDateIsValid,
    getIfDateRangeIsValid,
} from "../../../../../../commom/utils/date";

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

            const otherInputName = isStartedAt ? "endedAt" : "startedAt";

            const editedInputValue = event.target.value;
            const otherInputValue = formData[otherInputName];

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
