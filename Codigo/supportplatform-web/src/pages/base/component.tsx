import { Box, PageLayout } from "@primer/react";
import { Outlet } from "react-router";
import PageHeader from "./components/pageHeader";
import PageFooter from "./components/pageFooter";
import { memo } from "react";
import PageLoadingIndicator from "./components/pageLoadingIndicator";
import CreateEvaluationMethodModal from "./components/createEvaluationMethodModal";
import SearchParamControlledModal from "../../commom/components/searchParamControlledModal";
import appRoutes from "../../commom/routes/appRoutes";

const pageSearchParams = appRoutes.base.search;
const pageModalSearchParamsValues = appRoutes.base.searchValues.modal;

function BasePage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <PageHeader />

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <PageLayout.Content sx={{ flexGrow: 1, width: "100%" }}>
                    <PageLoadingIndicator />
                    <Outlet />
                </PageLayout.Content>
                <PageFooter />
            </Box>

            {/* general modals */}
            <SearchParamControlledModal
                header="Novo método avaliativo"
                aria-label="Criar método avaliativo"
                searchParam={pageSearchParams.modal}
                openValue={pageModalSearchParamsValues.createEvaluationMethod}
            >
                <CreateEvaluationMethodModal />
            </SearchParamControlledModal>
        </Box>
    );
}

export default memo(BasePage);
