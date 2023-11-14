import { useFetcher, useSearchParams } from "react-router-dom";
import { ErrorResponseDTO, StandardizedIssueCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useEvaluationMethodStandardizedIssueById } from "../../../../../../commom/data/standardizedIssue";
import { Box, Spinner } from "@primer/react";
import StandardizedIssueForm from "../standardizedIssueForm";

interface IEditStandardizedIssueModalProps {
    evaluationMethodId: number;
}

const pageSearchParams =
    appRoutes.evaluationMethod.detail.standardizedIssue.detail.search;

export default function EditStandardizedIssueModal(
    props: IEditStandardizedIssueModalProps
) {
    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof StandardizedIssueCreateDTO> & {
              success?: boolean;
          })
        | undefined;

    const [searchParams, setSearchParams] = useSearchParams();
    const standardizedIssueIdParam = searchParams.get(pageSearchParams.id);
    const standardizedIssueId = standardizedIssueIdParam
        ? Number(standardizedIssueIdParam)
        : undefined;

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

    const { data, isLoading } = useEvaluationMethodStandardizedIssueById(
        props.evaluationMethodId,
        standardizedIssueId!,
        {
            enabled: Boolean(standardizedIssueId),
        }
    );

    return (
        <fetcher.Form
            method="put"
            action={appRoutes.evaluationMethod.detail.standardizedIssue.detail.link(
                props.evaluationMethodId,
                standardizedIssueId!
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
            {(!standardizedIssueId || !data) && !isLoading && (
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
                            Issue padronizada não encontrada
                        </Box>
                    </Box>
                </Box>
            )}
            {data && (
                <StandardizedIssueForm
                    submitButtonText="Editar"
                    error={responseObject?.error}
                    isSubmitting={fetcher.state === "submitting"}
                    defaultTitle={data.title}
                    defaultDescription={data.description ?? ""}
                />
            )}
        </fetcher.Form>
    );
}
