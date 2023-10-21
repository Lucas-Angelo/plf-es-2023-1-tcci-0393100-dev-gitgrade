import { useFetcher, useSearchParams } from "react-router-dom";
import { ErrorResponseDTO, StandardizedIssueCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import StandardizedIssueForm from "../standardizedIssueForm";

export default function AddStandardizedIssueModal() {
    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof StandardizedIssueCreateDTO> & {
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
            <StandardizedIssueForm
                submitButtonText="Criar"
                error={responseObject?.error}
                isSubmitting={fetcher.state === "submitting"}
            />
        </fetcher.Form>
    );
}
