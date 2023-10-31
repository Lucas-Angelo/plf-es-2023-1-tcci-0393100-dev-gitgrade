import { Box, Pagination } from "@primer/react";
import { Params, useLoaderData, useParams } from "react-router";
import { RepositoryBranchesLoaderData } from "./loader";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../commom/routes/appRoutes";
import BranchCard from "./components/branchCard";
import { useRepositoryById } from "../../../../../commom/data/repo";

const pageSearchParams = appRoutes.repo.detail.config.branches.search;
const pageRouteParams = appRoutes.repo.detail.params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryBranchesConfigPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams() as Params<PageRouteParams>;

    const { results, totalPages } =
        useLoaderData() as RepositoryBranchesLoaderData;

    const { data: repositoryData } = useRepositoryById(Number(id));
    const defaultBranchName = repositoryData?.defaultBranch;

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }

    const page = Number(searchParams.get("page")) || 1;

    return (
        <Box
            sx={{
                mx: 2,
            }}
        >
            {results.map((branch) => (
                <Box
                    key={branch.id}
                    sx={{ mb: 2 }}
                >
                    <BranchCard
                        commit_automatic_synchronization={
                            branch.commitAutomaticSynchronization
                        }
                        file_automatic_synchronization={
                            branch.fileAutomaticSynchronization
                        }
                        name={branch.name}
                        id={branch.id}
                        repositoryId={branch.repositoryId}
                        isDefaultBranch={branch.name === defaultBranchName}
                    />
                </Box>
            ))}
            <Pagination
                currentPage={page}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                hrefBuilder={(n) => `?${pageSearchParams.page}=${n}`}
            />
        </Box>
    );
}
