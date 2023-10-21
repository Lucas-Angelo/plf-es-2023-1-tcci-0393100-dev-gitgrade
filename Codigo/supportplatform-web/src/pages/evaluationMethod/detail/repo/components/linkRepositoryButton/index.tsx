import { Box, Button } from "@primer/react";
import SearchParamControlledModal from "../../../../../../commom/components/searchParamControlledModal";
import LinkRepositoryModal from "../linkRepositoryModal";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";

export default function LinkRepositoryButton() {
    const [, setSearchParams] = useSearchParams();
    function handleLinkRepositoryButtonClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [appRoutes.base.search.modal]:
                appRoutes.base.searchValues.modal
                    .linkRepositoryToEvaluationMethod,
        }));
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 3,
            }}
        >
            <Button
                variant="primary"
                onClick={handleLinkRepositoryButtonClick}
            >
                Adicionar repositório
            </Button>

            <SearchParamControlledModal
                header="Adicionar repositório ao método avaliativo"
                searchParam={appRoutes.base.search.modal}
                openValue={
                    appRoutes.base.searchValues.modal
                        .linkRepositoryToEvaluationMethod
                }
            >
                <LinkRepositoryModal />
            </SearchParamControlledModal>
        </Box>
    );
}
