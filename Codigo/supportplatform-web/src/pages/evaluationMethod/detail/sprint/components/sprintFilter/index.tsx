import { Box, TextInput } from "@primer/react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { SearchIcon } from "@primer/octicons-react";

const pageSearchParams = appRoutes.evaluationMethod.detail.sprint.search;

export default function SprintFilter() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = searchParams.get(pageSearchParams.name) ?? undefined;

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const filter = inputRef.current?.value;
        console.log("ola rapazes", filter);

        setSearchParams((previousSearchParams) => {
            if (!filter) previousSearchParams.delete(pageSearchParams.name);
            previousSearchParams.set(pageSearchParams.name, filter || "");
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
                    placeholder="nome da sprint"
                    sx={{ width: "100%" }}
                    ref={inputRef}
                    defaultValue={defaultFilter}
                />
            </form>
        </Box>
    );
}
