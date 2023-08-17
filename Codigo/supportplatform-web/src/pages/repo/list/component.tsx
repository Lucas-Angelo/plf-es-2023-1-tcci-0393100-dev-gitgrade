import {
    ActionList,
    ActionMenu,
    FilteredSearch,
    PageLayout,
    Pagination,
    TextInput,
    Box,
} from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../commom/routes/appRoutes";
import RepoCard from "../components/repoCard";
import { IGetAllRepoResponse } from "../../../commom/models/repo";

const pageSearchParams = appRoutes.repo.list.search;

export default function RepoListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const loaderData = useLoaderData() as IGetAllRepoResponse;

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }
    return (
        <PageLayout containerWidth="large">
            <FilteredSearch sx={{ width: "100%", alignItems: "stretch" }}>
                <ActionMenu>
                    <ActionMenu.Button sx={{ height: "100%" }}>
                        Filtrar
                    </ActionMenu.Button>
                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item>Filtro 1</ActionList.Item>
                            <ActionList.Item>Filtro 2</ActionList.Item>
                            <ActionList.Item>Filtro 3</ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="ma:TI5-2023"
                    sx={{ flexGrow: 1 }}
                />
            </FilteredSearch>

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.map((repo) => (
                    <Box
                        sx={{ mb: 3 }}
                        key={repo.id}
                    >
                        <RepoCard
                            name={repo.name}
                            evaluationMethodName={repo.evaluationMethodName}
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
