import { PageLayout, Pagination, Box } from "@primer/react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../commom/routes/appRoutes";
import RepoCard from "../../../commom/components/repoCard";
import { RepoListPageLoaderData } from "./loader";
import RepoFilter from "./components/repoFilter";

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
                    <Box
                        sx={{ mb: 3 }}
                        key={repo.id}
                    >
                        <RepoCard
                            name={repo.name}
                            evaluationMethodName={
                                repo.evaluationMethod?.description
                            }
                            id={repo.id}
                            key={repo.id}
                        />
                    </Box>
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
