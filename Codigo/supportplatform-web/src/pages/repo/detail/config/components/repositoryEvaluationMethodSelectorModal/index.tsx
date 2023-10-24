import {
    Box,
    Pagination,
    Link as PrimerLink,
    TextInput,
    Spinner,
    IconButton,
    Octicon,
} from "@primer/react";
import { useEvaluationMethodList } from "../../../../../../commom/data/evaluationMethod";
import React, { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { SearchIcon, XIcon } from "@primer/octicons-react";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IRepositoryEvaluationMethodSelectorModalProps {
    onClose?: () => void;
    repositoryId: number;
    evaluationMethodId?: number;
}

export default function RepositoryEvaluationMethodSelectorModal(
    props: IRepositoryEvaluationMethodSelectorModalProps
) {
    const [page, setPage] = useState(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");

    const { data, isLoading } = useEvaluationMethodList({
        description: search,
        page,
        limit: 5,
    });

    const fetcher = useFetcher();
    const responseObject = fetcher.data as
        | {
              error?: string;
              success?: boolean;
          }
        | undefined;

    const hadSuccess = responseObject?.success;

    const onSaveRef = useRef(props.onClose);
    onSaveRef.current = props.onClose;

    useEffect(() => {
        if (hadSuccess) {
            onSaveRef.current?.();
        }
    }, [hadSuccess, onSaveRef]);

    function handlePageChange(
        e: React.MouseEvent<Element, MouseEvent>,
        page: number
    ) {
        e.preventDefault();
        setPage(page);
    }

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const inputValue = inputRef.current?.value;
        setSearch(inputValue ?? "");
        setPage(1);
    }

    function handleEvaluationMethodSelect(id: number) {
        fetcher.submit(
            {},
            {
                method: "POST",
                action: appRoutes.evaluationMethod.detail.repo.detail.link(
                    id,
                    props.repositoryId
                ),
            }
        );
    }

    function handleEvaluationMethodClear() {
        fetcher.submit(
            {},
            {
                method: "DELETE",
                action: appRoutes.evaluationMethod.detail.repo.detail.link(
                    props.evaluationMethodId!,
                    props.repositoryId
                ),
            }
        );
    }

    return (
        <Box
            sx={{
                p: 1,
                width: ["calc( 100vw - 25px )", "calc( 100vw - 25px )", 500],
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <IconButton
                    icon={XIcon}
                    variant="invisible"
                    as="button"
                    onClick={props.onClose}
                    aria-labelledby="Fechar modal de seleção de método avaliativo"
                />
            </Box>

            <Box sx={{ m: 3 }}>
                {props.evaluationMethodId && fetcher.state !== "submitting" && (
                    <Box
                        sx={{
                            my: 2,
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: "transparent",
                            display: "block",
                        }}
                        onClick={() => handleEvaluationMethodClear()}
                        as="button"
                    >
                        <PrimerLink
                            sx={{
                                color: "darkred",
                            }}
                        >
                            <Octicon
                                icon={XIcon}
                                sx={{ mr: 1 }}
                            />
                            Remover método avaliativo vinculado
                        </PrimerLink>
                    </Box>
                )}
                <form
                    onSubmit={handleSearch}
                    style={{ flexGrow: 1 }}
                >
                    <TextInput
                        leadingVisual={SearchIcon}
                        placeholder="nome do método avaliativo"
                        defaultValue={search}
                        ref={inputRef}
                        sx={{ width: "100%" }}
                    />
                </form>
                {!data && !isLoading && (
                    <Box
                        sx={{
                            color: "gray",
                        }}
                    >
                        Erro ao carregar...
                    </Box>
                )}
                {isLoading || fetcher.state === "submitting" ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Spinner />
                    </Box>
                ) : (
                    data && (
                        <>
                            {data.results.length === 0 ? (
                                <Box
                                    sx={{
                                        color: "gray",
                                    }}
                                >
                                    Nenhum método avaliativo encontrado
                                </Box>
                            ) : (
                                data.results.map((evaluationMethod) => (
                                    <Box
                                        key={evaluationMethod.id}
                                        sx={{
                                            my: 2,
                                            cursor:
                                                evaluationMethod.id ==
                                                props.evaluationMethodId
                                                    ? "not-allowed"
                                                    : "pointer",
                                            border: "none",
                                            backgroundColor: "transparent",
                                            display: "block",
                                        }}
                                        disabled={
                                            evaluationMethod.id ==
                                            props.evaluationMethodId
                                        }
                                        onClick={() =>
                                            handleEvaluationMethodSelect(
                                                evaluationMethod.id
                                            )
                                        }
                                        as="button"
                                    >
                                        <PrimerLink
                                            sx={{
                                                color:
                                                    evaluationMethod.id ==
                                                    props.evaluationMethodId
                                                        ? "gray"
                                                        : undefined,
                                            }}
                                        >
                                            {evaluationMethod.description} -{" "}
                                            {evaluationMethod.year}/
                                            {evaluationMethod.semester}
                                            {evaluationMethod.id ==
                                                props.evaluationMethodId &&
                                                " (Vinculado)"}
                                        </PrimerLink>
                                    </Box>
                                ))
                            )}
                        </>
                    )
                )}
                <Pagination
                    currentPage={page}
                    onPageChange={handlePageChange}
                    pageCount={data?.totalPages || 1}
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
        </Box>
    );
}
