import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import {
    Box,
    Button,
    FormControl,
    Select,
    Spinner,
    TextInput,
} from "@primer/react";
import { ErrorResponseDTO, EvaluationMethodCreateDTO } from "@gitgrade/dtos";

const listOfYears = [
    // generate more 10 years
    ...Array.from({ length: 10 }, (_, index) => `${index + 2012}`),
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    // generate more 20 years
    ...Array.from({ length: 20 }, (_, index) => `${index + 2028}`),
];

export default function CreateEvaluationMethodModal() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentSemester = currentMonth <= 6 ? 1 : 2;

    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | ErrorResponseDTO<keyof EvaluationMethodCreateDTO>
        | undefined;

    const isCreatingEvaluationMethod = fetcher.state === "submitting";

    return (
        <fetcher.Form
            method="post"
            action={appRoutes.evaluationMethod.path}
        >
            <Box
                sx={{
                    mx: 2,
                }}
            >
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Descrição</FormControl.Label>
                    <TextInput
                        name="description"
                        sx={{ width: "100%" }}
                    />
                    {responseObject?.error?.description && (
                        <FormControl.Validation variant="error">
                            {responseObject.error.description.message}
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
                                defaultValue={currentYear}
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
                            {responseObject?.error?.year && (
                                <FormControl.Validation variant="error">
                                    {responseObject.error.year.message}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Semestre</FormControl.Label>
                            <Select
                                name="semester"
                                defaultValue={currentSemester}
                            >
                                <Select.Option value="1">
                                    Primeiro (1)
                                </Select.Option>
                                <Select.Option value="2">
                                    Segundo (2)
                                </Select.Option>
                            </Select>
                            {responseObject?.error?.semester && (
                                <FormControl.Validation variant="error">
                                    {responseObject.error.semester.message}
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
                            disabled={isCreatingEvaluationMethod}
                        >
                            Criar
                        </Button>
                    </Box>
                </Box>
            </Box>

            {isCreatingEvaluationMethod && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Spinner size="small" />
                </Box>
            )}
        </fetcher.Form>
    );
}
