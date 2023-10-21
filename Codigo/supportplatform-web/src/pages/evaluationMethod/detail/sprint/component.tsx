import { Box, Pagination } from "@primer/react";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { EvaluationMethodSprintListLoaderData } from "./loader";
import SprintCard from "./components/sprintCard";
import AddSprintButton from "./components/addSprintButton";
import SprintFilter from "./components/sprintFilter";
import SearchParamControlledModal from "../../../../commom/components/searchParamControlledModal";
import EditSprintModal from "./components/editSprintModal";

const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;
const pageUrlParams = appRoutes.evaluationMethod.detail.params;
type PageUrlParam = (typeof pageUrlParams)[number];

export default function EvaluationMethodRepositoryListPage() {
    const { id: evaluationMethodIdParam } = useParams<PageUrlParam>();

    if (
        !evaluationMethodIdParam ||
        Number.isNaN(Number(evaluationMethodIdParam))
    ) {
        throw new Error("Evaluation method id is required");
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData = useLoaderData() as EvaluationMethodSprintListLoaderData;

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
                <SprintFilter />
                <AddSprintButton />
            </Box>

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhuma sprint cadastrada para esse método avaliativo
                    </Box>
                )}
                {loaderData.results.map((sprint) => (
                    <Box
                        sx={{
                            mb: 3,
                        }}
                        key={sprint.id}
                    >
                        <SprintCard
                            id={sprint.id}
                            name={sprint.name}
                            start_date={sprint.start_date}
                            end_date={sprint.end_date}
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
                header="Editar sprint"
                searchParam={appRoutes.base.search.modal}
                openValue={appRoutes.base.searchValues.modal.editSprint}
            >
                <EditSprintModal
                    evaluationMethodId={Number(evaluationMethodIdParam)}
                />
            </SearchParamControlledModal>
        </Box>
    );
}
