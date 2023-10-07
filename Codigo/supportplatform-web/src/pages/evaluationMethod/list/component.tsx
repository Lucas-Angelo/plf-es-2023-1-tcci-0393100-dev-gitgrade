import { PageLayout, Pagination, Box } from "@primer/react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../commom/routes/appRoutes";
import RepoCard from "./components/evaluationMethodCard";
import { EvaluationMethodListPageLoaderData } from "./loader";
import RepoFilter from "./components/evaluationMethodFilter";

const pageSearchParams = appRoutes.evaluationMethod.list.search;

export default function EvaluationMethodListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData = useLoaderData() as EvaluationMethodListPageLoaderData;

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
                        Nenhum método avaliativo encontrado
                    </Box>
                )}
                {loaderData.results.map((evaluationMethod) => (
                    <Box
                        sx={{ mb: 3 }}
                        key={evaluationMethod.id}
                    >
                        <RepoCard
                            name={evaluationMethod.description}
                            semester={evaluationMethod.semester}
                            year={evaluationMethod.year}
                            id={evaluationMethod.id}
                            key={evaluationMethod.id}
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
