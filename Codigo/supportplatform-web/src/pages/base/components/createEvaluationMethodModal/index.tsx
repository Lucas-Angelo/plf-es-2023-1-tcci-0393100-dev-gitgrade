import { useFetcher } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { ErrorResponseDTO, EvaluationMethodCreateDTO } from "@gitgrade/dtos";
import EvaluationMethodForm from "../../../../commom/components/evaluationMethodForm";

export default function CreateEvaluationMethodModal() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentSemester = currentMonth <= 6 ? 1 : 2;

    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | ErrorResponseDTO<keyof EvaluationMethodCreateDTO>
        | undefined;

    const isCreatingEvaluationMethod = fetcher.state === "submitting";

    return (
        <fetcher.Form
            method="post"
            action={appRoutes.evaluationMethod.path}
        >
            <EvaluationMethodForm
                defaultSemester={currentSemester.toString()}
                defaultYear={currentYear.toString()}
                isSubmitting={isCreatingEvaluationMethod}
                error={responseObject?.error}
                submitButtonText="Criar"
            />
        </fetcher.Form>
    );
}
