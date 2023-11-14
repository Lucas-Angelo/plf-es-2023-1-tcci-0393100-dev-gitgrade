import { useFetcher, useSearchParams } from "react-router-dom";
import SprintForm from "../../../../../../commom/components/sprintForm";
import { ErrorResponseDTO, SprintCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useEvaluationMethodSprintById } from "../../../../../../commom/data/sprint";
import { Box, Spinner } from "@primer/react";

interface IEditSprintModalProps {
    evaluationMethodId: number;
}

const pageSearchParams = appRoutes.evaluationMethod.detail.sprint.detail.search;

export default function EditSprintModal(props: IEditSprintModalProps) {
    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof SprintCreateDTO> & { success?: boolean })
        | undefined;

    const [searchParams, setSearchParams] = useSearchParams();
    const sprintIdParam = searchParams.get(pageSearchParams.id);
    const sprintId = sprintIdParam ? Number(sprintIdParam) : undefined;

    const isRenderedRef = useIsMountedRef();

    if (responseObject?.success && isRenderedRef.current) {
        setSearchParams((previousSearchParams) => {
            const previousSearchParamsCopy = new URLSearchParams(
                previousSearchParams
            );
            previousSearchParamsCopy.delete(appRoutes.base.search.modal);
            previousSearchParamsCopy.delete(pageSearchParams.id);
            return previousSearchParamsCopy;
        });
    }

    const { data, isLoading } = useEvaluationMethodSprintById(
        props.evaluationMethodId,
        sprintId!,
        {
            enabled: Boolean(sprintId),
        }
    );

    return (
        <fetcher.Form
            method="put"
            action={appRoutes.evaluationMethod.detail.sprint.detail.link(
                props.evaluationMethodId,
                sprintId!
            )}
        >
            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Spinner />
                </Box>
            )}
            {!sprintId || !data ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 4,
                                mb: 2,
                            }}
                        >
                            404
                        </Box>
                        <Box
                            sx={{
                                fontSize: 2,
                            }}
                        >
                            Sprint não encontrada
                        </Box>
                    </Box>
                </Box>
            ) : (
                data && (
                    <SprintForm
                        submitButtonText="Editar"
                        error={responseObject?.error}
                        isSubmitting={fetcher.state === "submitting"}
                        defaultEndDate={new Date(data.end_date)}
                        defaultStartDate={new Date(data.start_date)}
                        defaultName={data.name}
                    />
                )
            )}
        </fetcher.Form>
    );
}
