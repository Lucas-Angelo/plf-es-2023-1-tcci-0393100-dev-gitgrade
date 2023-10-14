import { Box, Pagination } from "@primer/react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { EvaluationMethodRepoListPageLoaderData } from "./loader";
import EvaluationMethodRepoFilter from "./components/evaluationMethodRepoFilter";
import RepoCard from "../../../../commom/components/repoCard";
import LinkRepositoryButton from "./components/linkRepositoryButton";

const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;

export default function EvaluationMethodRepositoryListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData =
        useLoaderData() as EvaluationMethodRepoListPageLoaderData;

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }

    return (
        <Box>
            <LinkRepositoryButton />
            <EvaluationMethodRepoFilter />

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhum repositório pertencente a esse método avaliativo
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
        </Box>
    );
}
