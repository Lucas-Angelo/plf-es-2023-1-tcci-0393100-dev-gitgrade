import { Box, Button } from "@primer/react";
import SearchParamControlledModal from "../../../../../../commom/components/searchParamControlledModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";
import AddStandardizedIssueModal from "../addStandardizedIssueModal";
import { PlusIcon } from "@primer/octicons-react";

export default function AddStandardizedIssueButton() {
    const [, setSearchParams] = useSearchParams();
    function handleAddStandardizedIssueButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal.createStandardizedIssue,
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
                onClick={handleAddStandardizedIssueButtonClick}
                leadingIcon={PlusIcon}
            >
                Nova
            </Button>

            <SearchParamControlledModal
                header="Nova issue padronizada"
                searchParam={appRoutes.base.search.modal}
                openValue={
                    appRoutes.base.searchValues.modal.createStandardizedIssue
                }
            >
                <AddStandardizedIssueModal />
            </SearchParamControlledModal>
        </Box>
    );
}
