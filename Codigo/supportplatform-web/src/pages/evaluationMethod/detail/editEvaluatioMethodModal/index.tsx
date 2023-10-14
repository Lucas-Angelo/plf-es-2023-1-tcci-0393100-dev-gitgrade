import { useFetcher, useSearchParams } from "react-router-dom";
import { ErrorResponseDTO, EvaluationMethodCreateDTO } from "@gitgrade/dtos";
import EvaluationMethodForm from "../../../../commom/components/evaluationMethodForm";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useIsMountedRef } from "../../../../commom/hooks/useIsMountedRef";

interface IEditEvaluationMethodModalProps {
    id: number;
    description: string;
    year: number;
    semester: number;
}

export default function EditEvaluationMethodModal(
    props: IEditEvaluationMethodModalProps
) {
    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | (ErrorResponseDTO<keyof EvaluationMethodCreateDTO> & {
              success?: boolean;
          })
        | undefined;

    const isEdittingEvaluationMethod = fetcher.state === "submitting";

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
        <fetcher.Form method="put">
            <EvaluationMethodForm
                defaultSemester={props.semester.toString()}
                defaultYear={props.year.toString()}
                defaultDescription={props.description}
                isSubmitting={isEdittingEvaluationMethod}
                error={responseObject?.error}
                submitButtonText="Editar"
            />
        </fetcher.Form>
    );
}
