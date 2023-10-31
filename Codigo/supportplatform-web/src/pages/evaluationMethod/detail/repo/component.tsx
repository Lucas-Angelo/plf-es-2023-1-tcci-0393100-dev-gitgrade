import { Box, Pagination, Button } from "@primer/react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { EvaluationMethodRepoListPageLoaderData } from "./loader";
import EvaluationMethodRepoFilter from "./components/evaluationMethodRepoFilter";
import LinkRepositoryButton from "./components/linkRepositoryButton";
import EvaluationMethodRepository from "./components/evaluationMethodRepository";
import { useState } from "react";

const pageSearchParams = appRoutes.evaluationMethod.detail.repo.search;

export default function EvaluationMethodRepositoryListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const [repositoryIdSet, setRepositoryIdSet] = useState(new Set<number>());

    const loaderData =
        useLoaderData() as EvaluationMethodRepoListPageLoaderData;

    const fetcher = useFetcher();

    const submitSyncSearchParams = new URLSearchParams();
    repositoryIdSet.forEach((repositoryId) =>
        submitSyncSearchParams.append(
            appRoutes.repo.sync.search.repositoryId,
            repositoryId.toString()
        )
    );
    const syncSelectedSubmitUrl = `${appRoutes.repo.sync.link()}?${submitSyncSearchParams.toString()}`;
    const repositoryIdsSynchronizing = fetcher.formAction
        ? new URLSearchParams(fetcher.formAction.split("?")[1])
              .getAll(appRoutes.repo.sync.search.repositoryId)
              .map((repositoryId) => Number(repositoryId))
        : [];

    function handlePageChange(e: React.MouseEvent, newPage: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, newPage.toString());
            return previousSearchParams;
        });
    }

    function handleRepositoryCheckedChange(
        repositoryId: number,
        checked: boolean
    ) {
        setRepositoryIdSet((previousRepositoryIdSet) => {
            const newRepositoryIdSet = new Set(previousRepositoryIdSet);
            if (checked) {
                newRepositoryIdSet.add(repositoryId);
            } else {
                newRepositoryIdSet.delete(repositoryId);
            }
            return newRepositoryIdSet;
        });
    }

    function handleSyncSelectedRepositoriesSubmit() {
        setRepositoryIdSet(new Set());
    }

    return (
        <Box>
            <Box
                sx={{
                    display: ["grid", "flex"],
                    gridTemplateColumns: [
                        "repeat(auto-fit, minmax(186px, 1fr))",
                    ],
                    justifyContent: ["center", "flex-end"],
                    mb: 3,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <fetcher.Form
                    method="PATCH"
                    action={syncSelectedSubmitUrl}
                    onSubmit={handleSyncSelectedRepositoriesSubmit}
                >
                    <Button
                        disabled={
                            fetcher.state === "submitting" ||
                            repositoryIdSet.size === 0
                        }
                        type="submit"
                        sx={{
                            width: ["100%", "auto"],
                        }}
                    >
                        Sincronizar selecionados
                    </Button>
                </fetcher.Form>
                <LinkRepositoryButton />
            </Box>
            <EvaluationMethodRepoFilter />

            <Box sx={{ width: "100%", my: 5 }}>
                {loaderData.results.length === 0 && (
                    <Box sx={{ textAlign: "center", color: "gray" }}>
                        Nenhum repositório pertencente a esse método avaliativo
                    </Box>
                )}
                {loaderData.results.map((repo) => (
                    <EvaluationMethodRepository
                        key={repo.id}
                        id={repo.id}
                        name={repo.name}
                        checked={repositoryIdSet.has(repo.id)}
                        onChecked={(checked) =>
                            handleRepositoryCheckedChange(repo.id, checked)
                        }
                        synchronizing={repositoryIdsSynchronizing.includes(
                            repo.id
                        )}
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
        </Box>
    );
}
