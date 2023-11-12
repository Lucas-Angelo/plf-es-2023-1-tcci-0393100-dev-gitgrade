import appRoutes from "../../../../commom/routes/appRoutes";
import { useParams, useLoaderData } from "react-router";
import { useSearchParams } from "react-router-dom";
import { Box, Pagination } from "@primer/react";
import StandardizedIssueFilter from "./components/standadizedIssueFilter";
import AddStandardizedIssueButton from "./components/addStandardizedIssueButton";
import { EvaluationMethodStandardizedIssueListLoaderData } from "./loader";
import StandardizedIssueCard from "./components/standardizedIssueCard";
import SearchParamControlledModal from "../../../../commom/components/searchParamControlledModal";
import EditStandardizedIssueModal from "./components/editStandardizedIssueModal";

const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;
const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default function EvaluationMethodStandardizedIssueListPage() {
    const { id: evaluationMethodIdParam } = useParams<PageUrlParam>();

    if (
        !evaluationMethodIdParam ||
        Number.isNaN(Number(evaluationMethodIdParam))
    ) {
        throw new Error("Evaluation method id is required");
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData =
        useLoaderData() as EvaluationMethodStandardizedIssueListLoaderData;

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap-reverse",
                }}
            >
                <StandardizedIssueFilter />
                <AddStandardizedIssueButton />
            </Box>

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhuma issue padronizada cadastrada para esse método
                        avaliativo
                    </Box>
                )}
                {loaderData.results.map((standardizedIssue) => (
                    <Box
                        sx={{
                            mb: 3,
                        }}
                        key={standardizedIssue.id}
                    >
                        <StandardizedIssueCard
                            id={standardizedIssue.id}
                            title={standardizedIssue.title}
                            evaluationMethodId={Number(evaluationMethodIdParam)}
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

            <SearchParamControlledModal
                header="Editar issue padronizada"
                searchParam={appRoutes.base.search.modal}
                openValue={
                    appRoutes.base.searchValues.modal.editStandardizedIssue
                }
            >
                <EditStandardizedIssueModal
                    evaluationMethodId={Number(evaluationMethodIdParam)}
                />
            </SearchParamControlledModal>
        </Box>
    );
}
