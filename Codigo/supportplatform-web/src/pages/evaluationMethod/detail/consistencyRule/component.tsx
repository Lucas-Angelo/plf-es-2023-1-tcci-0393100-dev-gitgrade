import { Box, Pagination } from "@primer/react";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { EvaluationMethodConsistencyRuleListLoaderData } from "./loader";
import ConsistencyRuleCard from "./components/consistencyRuleCard";
import AddConsistencyRuleButton from "./components/addConsistencyRuleButton";
import ConsistencyRuleFilter from "./components/consistencyRuleFilter";
import SearchParamControlledModal from "../../../../commom/components/searchParamControlledModal";
import EditConsistencyRuleModal from "./components/editConsistencyRuleModal";

const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;
const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default function EvaluationMethodConsistencyRuleListPage() {
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
        useLoaderData() as EvaluationMethodConsistencyRuleListLoaderData;

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
                <ConsistencyRuleFilter />
                <AddConsistencyRuleButton />
            </Box>

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhuma consistencyRule cadastrada para esse método
                        avaliativo
                    </Box>
                )}
                {loaderData.results.map((consistencyRule) => (
                    <Box
                        sx={{
                            mb: 3,
                        }}
                        key={consistencyRule.id}
                    >
                        <ConsistencyRuleCard
                            id={consistencyRule.id}
                            description={consistencyRule.description ?? ""}
                            evaluationMethodId={Number(evaluationMethodIdParam)}
                            sprintId={consistencyRule.sprintId}
                            standardizedIssueId={
                                consistencyRule.standardizedIssueId ?? undefined
                            }
                            filePath={consistencyRule.filePath}
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
                header="Editar regra de consistência"
                searchParam={appRoutes.base.search.modal}
                openValue={
                    appRoutes.base.searchValues.modal.editConsistencyRule
                }
            >
                <EditConsistencyRuleModal
                    evaluationMethodId={Number(evaluationMethodIdParam)}
                />
            </SearchParamControlledModal>
        </Box>
    );
}
