import { ErrorResponseDTO } from "@gitgrade/dtos";
import { Flash, PageLayout } from "@primer/react";
import { AxiosError } from "axios";
import { useRouteError } from "react-router";

export default function ErrorElement() {
    const error = useRouteError() as Error;

    let errorMessage = error.message ?? "Erro desconhecido";
    if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponseDTO>;
        if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
        }
    }

    return (
        <PageLayout>
            <Flash
                variant="danger"
                sx={{ width: "100%" }}
            >
                {errorMessage}
            </Flash>
        </PageLayout>
    );
}
