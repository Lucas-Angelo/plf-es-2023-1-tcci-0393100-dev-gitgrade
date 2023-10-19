import { useFetcher, useSearchParams, useParams } from "react-router-dom";
import { ErrorResponseDTO, ConsistencyRuleCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import ConsistencyRuleForm from "../consistencyRuleForm";

const pageParams = appRoutes.evaluationMethod.detail.params;
type PageParams = (typeof pageParams)[number];

export default function AddConsistencyRuleModal() {
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

    const [, setSearchParams] = useSearchParams();

    const isRenderedRef = useIsMountedRef();

    if (responseObject?.success && isRenderedRef.current) {
        setSearchParams((previousSearchParams) => {
            const previousSearchParamsCopy = new URLSearchParams(
                previousSearchParams
            );
            previousSearchParamsCopy.delete(appRoutes.base.search.modal);
            return previousSearchParamsCopy;
        });
    }

    return (
        <fetcher.Form method="post">
            <ConsistencyRuleForm
                submitButtonText="Criar"
                error={responseObject?.error}
                isSubmitting={fetcher.state === "submitting"}
                evaluationMethodId={evaluationMethodId}
            />
        </fetcher.Form>
    );
}
