import { Button } from "@primer/react";
import { PlusIcon } from "@primer/octicons-react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../commom/routes/appRoutes";

const basePageSearchParams = appRoutes.base.search;
const pageModalSearchParamsValues = appRoutes.base.searchValues.modal;

export default function AddEvaluationMethodButton() {
    const [, setSearchParams] = useSearchParams();
    function handleAddEvaluationMethodButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [basePageSearchParams.modal]:
                pageModalSearchParamsValues.createEvaluationMethod,
        }));
    }
    return (
        <Button
            variant="primary"
            leadingIcon={PlusIcon}
            type="button"
            onClick={handleAddEvaluationMethodButtonClick}
        >
            Novo
        </Button>
    );
}
