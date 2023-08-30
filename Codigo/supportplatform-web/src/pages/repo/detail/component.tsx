import { Outlet } from "react-router";
import RepoHead from "./components/repoHead";
import { Box } from "@primer/react";

export default function RepoPage() {
    return (
        <Box
            sx={{
                mx: [0, 2, 6],
                my: [0, 0, 4],
            }}
        >
            <RepoHead
                orgName="ICEI-PUC-Minas-PPLES-TI"
                repoName="plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos"
                constributors={[
                    {
                        avatarUrl:
                            "https://avatars.githubusercontent.com/u/60052506?v=4",
                        username: "gabrielmelo00",
                    },
                    {
                        avatarUrl:
                            "https://avatars.githubusercontent.com/u/60052505?v=4",
                        username: "jonesmoura858",
                    },
                    {
                        avatarUrl:
                            "https://avatars.githubusercontent.com/u/60052504?v=4",
                        username: "pererajulio",
                    },
                ]}
            />

            <Box
                sx={{
                    px: [2, 2, 8],
                    pt: [2, 2, 3],
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
