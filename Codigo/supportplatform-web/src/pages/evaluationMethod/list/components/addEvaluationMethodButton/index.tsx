import { Button } from "@primer/react";
import { PlusIcon } from "@primer/octicons-react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../commom/routes/appRoutes";

const basePageSearchParams = appRoutes.base.search;
const pageModalSearchParamsValues = appRoutes.base.searchValues.modal;

export default function AddEvaluationMethodButton() {
    const [, setSearchParams] = useSearchParams();
    function handleAddEvaluationMethodButtonClick() {
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(
                basePageSearchParams.modal,
                pageModalSearchParamsValues.createEvaluationMethod
            );
            return previousSearchParams;
        });
    }
    return (
        <Button
            variant="primary"
            leadingIcon={PlusIcon}
            type="button"
            onClick={handleAddEvaluationMethodButtonClick}
            sx={{
                width: ["100%", "auto"],
            }}
        >
            Novo
        </Button>
    );
}
