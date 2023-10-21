import { SprintCreateDTO } from "@gitgrade/dtos";
import { Box, Button, FormControl, Spinner, TextInput } from "@primer/react";
import { getDateToForm } from "../../utils/date";

interface ISprintFormProps {
    submitButtonText?: string;

    isSubmitting?: boolean;
    error?: {
        [key in keyof SprintCreateDTO]?: {
            message: string;
        };
    };

    defaultName?: string;
    defaultStartDate?: Date;
    defaultEndDate?: Date;
}

export default function SprintForm(props: ISprintFormProps) {
    const { error } = props;

    const defaultStartedDate = props.defaultStartDate
        ? getDateToForm(props.defaultStartDate)
        : undefined;
    const defaultEndDate = props.defaultEndDate
        ? getDateToForm(props.defaultEndDate)
        : undefined;

    return (
        <>
            <Box
                sx={{
                    mx: 2,
                    border: 0,
                    p: 0,
                }}
                as="fieldset"
                disabled={props.isSubmitting}
            >
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Nome</FormControl.Label>
                    <TextInput
                        name="name"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultName}
                    />
                    {error?.name && (
                        <FormControl.Validation variant="error">
                            {error.name.message}
                        </FormControl.Validation>
                    )}
                </FormControl>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            flexWrap: "wrap",
                        }}
                    >
                        <FormControl>
                            <FormControl.Label>Início</FormControl.Label>
                            <TextInput
                                name="start_date"
                                defaultValue={defaultStartedDate}
                                type="datetime-local"
                            />
                            {error?.start_date && (
                                <FormControl.Validation variant="error">
                                    {error.start_date.message}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Término</FormControl.Label>
                            <TextInput
                                name="end_date"
                                defaultValue={defaultEndDate}
                                type="datetime-local"
                            />
                            {error?.end_date && (
                                <FormControl.Validation variant="error">
                                    {error.end_date.message}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            height: "100%",
                            justifyContent: "flex-end",
                            flexGrow: 1,
                            mt: 4,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={props.isSubmitting}
                        >
                            {props.submitButtonText || "Enviar"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {props.isSubmitting && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Spinner size="small" />
                </Box>
            )}
        </>
    );
}
