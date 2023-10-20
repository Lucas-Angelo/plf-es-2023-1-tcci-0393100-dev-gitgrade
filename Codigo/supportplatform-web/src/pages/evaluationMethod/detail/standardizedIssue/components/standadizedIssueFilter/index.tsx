import { Box, TextInput } from "@primer/react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { SearchIcon } from "@primer/octicons-react";

const pageSearchParams =
    appRoutes.evaluationMethod.detail.standardizedIssue.search;

export default function StandardizedIssueFilter() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = searchParams.get(pageSearchParams.title) ?? undefined;

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const filter = inputRef.current?.value;

        setSearchParams((previousSearchParams) => {
            if (!filter) previousSearchParams.delete(pageSearchParams.title);
            previousSearchParams.set(pageSearchParams.title, filter || "");
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
                    placeholder="título da issue padronizada"
                    sx={{ width: "100%" }}
                    ref={inputRef}
                    defaultValue={defaultFilter}
                />
            </form>
        </Box>
    );
}
