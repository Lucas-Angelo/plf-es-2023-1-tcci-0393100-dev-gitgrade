import { Box, TextInput } from "@primer/react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "@primer/octicons-react";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const pageSearchParams = appRoutes.repo.detail.files.search;

export default function FileFilter() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = searchParams.get(pageSearchParams.path) ?? undefined;

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const filter = inputRef.current?.value;

        setSearchParams((previousSearchParams) => {
            if (!filter) previousSearchParams.delete(pageSearchParams.path);
            previousSearchParams.set(pageSearchParams.path, filter || "");
            previousSearchParams.set(pageSearchParams.page, "1");
            return previousSearchParams;
        });
    }

    return (
        <Box sx={{ flexGrow: 1, alignItems: "stretch" }}>
            <form
                onSubmit={handleSearch}
                style={{ flexGrow: 1 }}
            >
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="caminho do arquivo"
                    sx={{ width: "100%" }}
                    ref={inputRef}
                    defaultValue={defaultFilter}
                />
            </form>
        </Box>
    );
}
