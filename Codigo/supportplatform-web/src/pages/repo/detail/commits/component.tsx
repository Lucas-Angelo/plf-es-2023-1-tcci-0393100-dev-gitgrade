import { Box, Pagination } from "@primer/react";
import DateFilter from "../components/dateFilter";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useLoaderData, useParams } from "react-router";
import { useRepositoryById } from "../../../../commom/data/repo";
import BranchQueryNavigationMenu from "../components/branchQueryNavigationMenu";
import { RepositoryCommitListLoaderData } from "./loader";
import { useSearchParams } from "react-router-dom";
import CommitListGroupByDate from "./components/commitListGroupByDate";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageSearchParams = appRoutes.repo.detail.commits.search;

export default function RepositoryCommitsPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const { data: repositoryData } = useRepositoryById(id);
    const { results, totalPages } =
        useLoaderData() as RepositoryCommitListLoaderData;

    function handlePageChange(e: React.MouseEvent, page: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, String(page));
            return previousSearchParams;
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
                <CommitListGroupByDate
                    commits={results}
                    repoName={repositoryData?.name ?? ""}
                />
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
