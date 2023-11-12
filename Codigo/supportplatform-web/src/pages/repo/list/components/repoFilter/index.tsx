import { Box, TextInput } from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { useRef } from "react";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";

const pageSearchParams = appRoutes.repo.list.search;

export default function RepoFilter() {
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
        <Box sx={{ width: "100%", alignItems: "stretch" }}>
            <form
                onSubmit={handleSearch}
                style={{ flexGrow: 1 }}
            >
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="nome do repositório"
                    sx={{ width: "100%" }}
                    ref={inputRef}
                    defaultValue={defaultFilter}
                />
            </form>
        </Box>
    );
}
