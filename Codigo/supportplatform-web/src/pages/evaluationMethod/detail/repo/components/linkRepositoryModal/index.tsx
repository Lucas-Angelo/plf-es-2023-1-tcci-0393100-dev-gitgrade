import { Box, Link, Pagination, Spinner, TextInput } from "@primer/react";
import { useRepositoryList } from "../../../../../../commom/data/repo";
import React, { useRef, useState } from "react";
import { SearchIcon } from "@primer/octicons-react";
import { useFetcher, useSearchParams } from "react-router-dom";
import { useIsMountedRef } from "../../../../../../commom/hooks/useIsMountedRef";
import appRoutes from "../../../../../../commom/routes/appRoutes";

export default function LinkRepositoryModal() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isLoading } = useRepositoryList({
        evaluationMethodId: null,
        page,
        limit: 5,
        filter: search,
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | {
              error?: string;
              success?: boolean;
          }
        | undefined;

    const [, setSearchParams] = useSearchParams();

    const isRenderedRef = useIsMountedRef();

    if (responseObject?.success && isRenderedRef.current) {
        setSearchParams((previousSearchParams) => {
            const previousSearchParamsCopy = new URLSearchParams(
                previousSearchParams
            );
            previousSearchParamsCopy.delete(appRoutes.base.search.modal);
            return previousSearchParamsCopy;
        });
    }

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const inputValue = inputRef.current?.value;
        setSearch(inputValue ?? "");
        setPage(1);
    }

    function handleRepositorySelect(id: number) {
        fetcher.submit({}, { method: "POST", action: id.toString() });
    }

    if (isLoading || fetcher.state === "submitting")
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Spinner />
            </Box>
        );
    if (!data)
        return (
            <Box
                sx={{
                    color: "gray",
                }}
            >
                Erro ao carregar...
            </Box>
        );
    if (data.results.length === 0)
        return (
            <Box
                sx={{
                    color: "gray",
                }}
            >
                Nenhum repositório sem método avaliativo vinculado encontrado
            </Box>
        );

    return (
        <Box>
            <form
                onSubmit={handleSearch}
                style={{ flexGrow: 1 }}
            >
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="nome do repositório"
                    defaultValue={search}
                    ref={inputRef}
                    sx={{ width: "100%" }}
                />
            </form>
            {data.results.map((repo) => (
                <Box
                    key={repo.id}
                    sx={{ my: 2, cursor: "pointer" }}
                    onClick={() => handleRepositorySelect(repo.id)}
                >
                    <Link>{repo.name}</Link>
                </Box>
            ))}
            <Pagination
                currentPage={page}
                onPageChange={(_e, newPage) => setPage(newPage)}
                pageCount={data.totalPages}
            />

            {responseObject?.error && (
                <Box
                    sx={{
                        color: "red",
                        mt: 2,
                    }}
                >
                    {responseObject.error}
                </Box>
            )}
        </Box>
    );
}
