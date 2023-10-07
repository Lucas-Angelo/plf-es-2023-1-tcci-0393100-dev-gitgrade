import {
    ActionList,
    ActionMenu,
    FilteredSearch,
    TextInput,
} from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { useRef } from "react";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";

const pageSearchParams = appRoutes.evaluationMethod.list.search;

export default function EvaluationMethodFilter() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter =
        searchParams.get(pageSearchParams.filter) ?? undefined;

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const filter = inputRef.current?.value;

        setSearchParams((previousSearchParams) => {
            if (!filter) previousSearchParams.delete(pageSearchParams.filter);
            previousSearchParams.set(pageSearchParams.filter, filter || "");
            previousSearchParams.set(pageSearchParams.page, "1");
            return previousSearchParams;
        });
    }

    return (
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
            <form
                onSubmit={handleSearch}
                style={{ flexGrow: 1 }}
            >
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="nome do método"
                    sx={{ width: "100%" }}
                    ref={inputRef}
                    defaultValue={defaultFilter}
                />
            </form>
        </FilteredSearch>
    );
}
