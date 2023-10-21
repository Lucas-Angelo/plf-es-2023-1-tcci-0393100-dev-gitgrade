import { useFetcher, useSearchParams, useParams } from "react-router-dom";
import { ErrorResponseDTO, ConsistencyRuleCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useEvaluationMethodConsistencyRuleById } from "../../../../../../commom/data/consistencyRule";
import { Box, Spinner } from "@primer/react";
import ConsistencyRuleForm from "../consistencyRuleForm";

interface IEditConsistencyRuleModalProps {
    evaluationMethodId: number;
}

const pageParams = appRoutes.evaluationMethod.detail.params;
type PageParams = (typeof pageParams)[number];

const pageSearchParams =
    appRoutes.evaluationMethod.detail.consistencyRule.detail.search;

export default function EditConsistencyRuleModal(
    props: IEditConsistencyRuleModalProps
) {
    const { id: evaluationMethodIdParam } = useParams<PageParams>();

    if (!evaluationMethodIdParam) {
        throw new Error("Evaluation method id is required");
    }
    const evaluationMethodId = Number(evaluationMethodIdParam);
    if (Number.isNaN(evaluationMethodId)) {
        throw new Error("Evaluation method id is invalid");
    }

    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof ConsistencyRuleCreateDTO> & {
              success?: boolean;
          })
        | undefined;

    const [searchParams, setSearchParams] = useSearchParams();
    const consistencyRuleIdParam = searchParams.get(pageSearchParams.id);
    const consistencyRuleId = consistencyRuleIdParam
        ? Number(consistencyRuleIdParam)
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

    const { data, isLoading } = useEvaluationMethodConsistencyRuleById(
        props.evaluationMethodId,
        consistencyRuleId!,
        {
            enabled: Boolean(consistencyRuleId),
        }
    );

    return (
        <fetcher.Form
            method="put"
            action={`${appRoutes.evaluationMethod.detail.consistencyRule.detail.link(
                props.evaluationMethodId,
                consistencyRuleId!
            )}?${pageSearchParams.id}=${consistencyRuleIdParam}`}
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
            {(!consistencyRuleId || !data) && !isLoading && (
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
                            Regra de consistência não encontrada
                        </Box>
                    </Box>
                </Box>
            )}
            {data && (
                <ConsistencyRuleForm
                    submitButtonText="Editar"
                    error={responseObject?.error}
                    isSubmitting={fetcher.state === "submitting"}
                    evaluationMethodId={evaluationMethodId}
                    defaultDescription={data.description ?? undefined}
                    defaultSprintId={data.sprintId}
                    defaultStandardizedIssueId={
                        data.standardizedIssueId ?? undefined
                    }
                    defaultFilePath={data.filePath}
                    defaultValidationType={data.validationType}
                />
            )}
        </fetcher.Form>
    );
}
