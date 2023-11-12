import {
    Box,
    Button,
    FormControl,
    Select,
    Spinner,
    TextInput,
} from "@primer/react";
import { EvaluationMethodCreateDTO } from "@gitgrade/dtos";
import { listOfYears } from "../../utils/year";

interface IEvaluationMethodFormProps {
    defaultYear?: string;
    defaultSemester?: string;
    defaultDescription?: string;

    submitButtonText?: string;

    isSubmitting?: boolean;
    error?: {
        [key in keyof EvaluationMethodCreateDTO]?: {
            message: string;
        };
    };
}

export default function EvaluationMethodForm(
    props: IEvaluationMethodFormProps
) {
    const { error } = props;

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
                    <FormControl.Label>Descrição</FormControl.Label>
                    <TextInput
                        name="description"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultDescription}
                    />
                    {error?.description && (
                        <FormControl.Validation variant="error">
                            {error.description.message}
                        </FormControl.Validation>
                    )}
                </FormControl>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                        }}
                    >
                        <FormControl>
                            <FormControl.Label>Ano</FormControl.Label>
                            <Select
                                name="year"
                                defaultValue={props.defaultYear}
                            >
                                {listOfYears.map((year) => (
                                    <Select.Option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </Select.Option>
                                ))}
                            </Select>
                            {error?.year && (
                                <FormControl.Validation variant="error">
                                    {error.year.message}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Semestre</FormControl.Label>
                            <Select
                                name="semester"
                                defaultValue={props.defaultSemester}
                            >
                                <Select.Option value="1">
                                    Primeiro (1)
                                </Select.Option>
                                <Select.Option value="2">
                                    Segundo (2)
                                </Select.Option>
                            </Select>
                            {error?.semester && (
                                <FormControl.Validation variant="error">
                                    {error.semester.message}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            height: "100%",
                            justifyContent: "flex-end",
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
