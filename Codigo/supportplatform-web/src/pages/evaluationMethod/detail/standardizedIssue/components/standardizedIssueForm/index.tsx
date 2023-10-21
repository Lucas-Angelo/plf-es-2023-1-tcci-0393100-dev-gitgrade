import { StandardizedIssueCreateDTO } from "@gitgrade/dtos";
import {
    Box,
    Button,
    FormControl,
    Spinner,
    TextInput,
    Textarea,
} from "@primer/react";

interface IStandardizedIssueFormProps {
    submitButtonText?: string;

    isSubmitting?: boolean;
    error?: {
        [key in keyof StandardizedIssueCreateDTO]?: {
            message: string;
        };
    };

    defaultTitle?: string;
    defaultDescription?: string;
}

export default function StandardizedIssueForm(
    props: IStandardizedIssueFormProps
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
                    <FormControl.Label>Título</FormControl.Label>
                    <TextInput
                        name="title"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultTitle}
                    />
                    {error?.title && (
                        <FormControl.Validation variant="error">
                            {error.title.message}
                        </FormControl.Validation>
                    )}
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Descrição</FormControl.Label>
                    <Textarea
                        name="description"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultDescription}
                        resize="vertical"
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

            {props.isSubmitting && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Spinner size="small" />
                </Box>
            )}
        </>
    );
}
