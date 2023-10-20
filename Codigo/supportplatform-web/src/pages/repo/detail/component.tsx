import { Outlet, useParams } from "react-router";
import RepoHead from "./components/repoHead";
import { Box } from "@primer/react";
import appRoutes from "../../../commom/routes/appRoutes";
import { useRepositoryById } from "../../../commom/data/repo";
import { useContributorsByRepositoryId } from "../../../commom/data/contributor";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepoPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: repositoryData } = useRepositoryById(id);
    const { data: repositoryContributorsData } =
        useContributorsByRepositoryId(id);

    return (
        <Box
            sx={{
                mx: [0, 2, 6],
                my: [0, 0, 4],
            }}
        >
            <RepoHead
                orgName="ICEI-PUC-Minas-PPLES-TI"
                repoName={repositoryData!.name}
                contributors={repositoryContributorsData!.results}
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
