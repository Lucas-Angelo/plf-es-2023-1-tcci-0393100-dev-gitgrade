import { Box, Button } from "@primer/react";
import SearchParamControlledModal from "../../../../../../commom/components/searchParamControlledModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";
import AddConsistencyRuleModal from "../addConsistencyRuleModal";
import { PlusIcon } from "@primer/octicons-react";

export default function AddConsistencyRuleButton() {
    const [, setSearchParams] = useSearchParams();
    function handleAddConsistencyRuleButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal.createConsistencyRule,
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
                onClick={handleAddConsistencyRuleButtonClick}
                leadingIcon={PlusIcon}
            >
                Nova
            </Button>

            <SearchParamControlledModal
                header="Nova consistencyRule"
                searchParam={appRoutes.base.search.modal}
                openValue={
                    appRoutes.base.searchValues.modal.createConsistencyRule
                }
            >
                <AddConsistencyRuleModal />
            </SearchParamControlledModal>
        </Box>
    );
}
