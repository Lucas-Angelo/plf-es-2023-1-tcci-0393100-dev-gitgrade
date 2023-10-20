import { useFetcher, useSearchParams } from "react-router-dom";
import SprintForm from "../../../../../../commom/components/sprintForm";
import { ErrorResponseDTO, SprintCreateDTO } from "@gitgrade/dtos";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";

export default function AddSprintModal() {
    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof SprintCreateDTO> & { success?: boolean })
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
            <SprintForm
                submitButtonText="Criar"
                error={responseObject?.error}
                isSubmitting={fetcher.state === "submitting"}
            />
        </fetcher.Form>
    );
}
