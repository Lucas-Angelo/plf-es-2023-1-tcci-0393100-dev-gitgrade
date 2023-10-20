import { Box, Button } from "@primer/react";
import { useFetcher } from "react-router-dom";

interface IInactivateEvaluationMethodButtonProps {
    semester: number;
    year: number;
    description: string;
    disabledAt: Date | null | undefined;
}

export default function InactivateEvaluationMethodButton(
    props: IInactivateEvaluationMethodButtonProps
) {
    const fetcher = useFetcher();
    const isInactive = fetcher.formMethod
        ? fetcher.formMethod === "delete"
        : props.disabledAt !== null;

    return (
        <fetcher.Form method={isInactive ? "put" : "delete"}>
            <Box sx={{ display: "none" }}>
                <input
                    name="semester"
                    value={props.semester}
                />
                <input
                    name="year"
                    value={props.year}
                />
                <input
                    name="description"
                    value={props.description}
                />
            </Box>
            <Button
                variant={isInactive ? "primary" : "danger"}
                name="activate"
                value={isInactive ? "true" : "false"}
                type="submit"
            >
                {isInactive ? "Ativar" : "Inativar"}
            </Button>
        </fetcher.Form>
    );
}
