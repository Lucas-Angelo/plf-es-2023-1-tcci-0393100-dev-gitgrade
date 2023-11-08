import { PageLayout, Pagination, Box } from "@primer/react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../commom/routes/appRoutes";
import { RepoListPageLoaderData } from "./loader";
import RepoFilter from "./components/repoFilter";
import RepositoryRow from "./components/repositoryRow";

const pageSearchParams = appRoutes.repo.list.search;

export default function RepoListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData = useLoaderData() as RepoListPageLoaderData;

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }
    return (
        <PageLayout containerWidth="large">
            <RepoFilter />

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhum repositório encontrado
                    </Box>
                )}
                {loaderData.results.map((repo) => (
                    <RepositoryRow
                        key={repo.id}
                        id={repo.id}
                        name={repo.name}
                        evaluationMethod={repo.evaluationMethod ?? undefined}
                    />
                ))}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <Box>
                    <Pagination
                        currentPage={page}
                        pageCount={loaderData.totalPages}
                        onPageChange={handlePageChange}
                        hrefBuilder={(n) => `?${pageSearchParams.page}=${n}`}
                    />
                </Box>
            </Box>
        </PageLayout>
    );
}
