import { Box, Pagination } from "@primer/react";
import DateFilter from "../components/dateFilter";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useLoaderData, useParams } from "react-router";
import { useRepositoryById } from "../../../../commom/data/repo";
import BranchQueryNavigationMenu from "../components/branchQueryNavigationMenu";
import { RepositoryFileListLoaderData } from "./loader";
import { useSearchParams } from "react-router-dom";
import FileCard from "./components/fileCard";
import FileFilter from "./components/fileFilter";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageSearchParams = {
    ...appRoutes.repo.detail.search,
    ...appRoutes.repo.detail.files.search,
};

export default function RepositoryFilesPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const { data: repositoryData } = useRepositoryById(id);
    const { results, totalPages } =
        useLoaderData() as RepositoryFileListLoaderData;

    const branchName =
        searchParams.get(pageSearchParams.branch) ??
        repositoryData?.defaultBranch ??
        "main";

    function handlePageChange(e: React.MouseEvent, page: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, String(page));
            return previousSearchParams;
        });
    }

    function handleAvatarClick(githubLogin: string | null) {
        setSearchParams((previousSearchParams) => {
            const newSearchParams = new URLSearchParams(previousSearchParams);
            newSearchParams.delete(pageSearchParams.page);

            if (githubLogin) {
                newSearchParams.set(pageSearchParams.contributor, githubLogin);
                newSearchParams.delete(
                    pageSearchParams.filterWithNoContributor
                );
            } else {
                newSearchParams.delete(pageSearchParams.contributor);
                newSearchParams.set(
                    pageSearchParams.filterWithNoContributor,
                    "true"
                );
            }

            return newSearchParams;
        });
    }

    return (
        <Box>
            <DateFilter
                evaluationMethodId={repositoryData?.evaluationMethod?.id}
                repositoryGithubCreatedAt={repositoryData?.githubCreatedAt}
            >
                <BranchQueryNavigationMenu
                    repositoryId={id}
                    defaultBranchName={repositoryData?.defaultBranch}
                />
            </DateFilter>

            <Box
                sx={{
                    mt: 4,
                }}
            >
                <FileFilter />
                {results.map((item) => (
                    <Box
                        key={item.path}
                        sx={{
                            mt: 3,
                        }}
                    >
                        <FileCard
                            path={item.path}
                            contributors={item.contributors}
                            additions={item.additions}
                            deletions={item.deletions}
                            onAvatarClick={handleAvatarClick}
                            repoName={repositoryData?.name ?? ""}
                            branchName={branchName}
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
        </Box>
    );
}
