import { Box, Button } from "@primer/react";
import SearchParamControlledModal from "../../../../../../commom/components/searchParamControlledModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";
import AddSprintModal from "../addSprintModal";
import { PlusIcon } from "@primer/octicons-react";

export default function AddSprintButton() {
    const [, setSearchParams] = useSearchParams();
    function handleAddSprintButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal.createSprint,
        }));
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
            }}
        >
            <Button
                variant="primary"
                onClick={handleAddSprintButtonClick}
                leadingIcon={PlusIcon}
            >
                Nova
            </Button>

            <SearchParamControlledModal
                header="Nova sprint"
                searchParam={appRoutes.base.search.modal}
                openValue={appRoutes.base.searchValues.modal.createSprint}
            >
                <AddSprintModal />
            </SearchParamControlledModal>
        </Box>
    );
}
