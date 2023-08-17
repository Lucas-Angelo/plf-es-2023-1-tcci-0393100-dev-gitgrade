import { Box, PageLayout } from "@primer/react";
import { Outlet } from "react-router";
import PageHeader from "./components/pageHeader";
import PageFooter from "./components/pageFooter";
import { memo } from "react";

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
                    <Outlet />
                </PageLayout.Content>
                <PageFooter />
            </Box>
        </Box>
    );
}

export default memo(BasePage);
