import { Box, Select, TextInput } from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { useRef } from "react";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import { listOfYears } from "../../../../../commom/utils/year";

const pageSearchParams = appRoutes.evaluationMethod.list.search;

export default function EvaluationMethodFilter() {
    const formRef = useRef<HTMLFormElement>(null);
    const submit = useSubmit();

    const [searchParams] = useSearchParams();
    const defaultFilter =
        searchParams.get(pageSearchParams.description) ?? undefined;
    const defaultYear = searchParams.get(pageSearchParams.year) ?? undefined;
    const defaultSemester =
        searchParams.get(pageSearchParams.semester) ?? undefined;

    function handleSelectChange() {
        submit(formRef.current);
    }

    return (
        <Box sx={{ width: "100%", alignItems: "stretch", height: "100%" }}>
            <Form
                ref={formRef}
                style={{ flexGrow: 1, display: "flex", gap: 4 }}
            >
                <TextInput
                    leadingVisual={SearchIcon}
                    placeholder="nome do método"
                    name={pageSearchParams.description}
                    sx={{ width: "100%" }}
                    defaultValue={defaultFilter}
                />
                <Select
                    className="select-with-placeholder"
                    name={pageSearchParams.year}
                    onChange={handleSelectChange}
                    defaultValue={defaultYear}
                    style={{
                        minWidth: 70,
                    }}
                >
                    <Select.Option value="">Ano</Select.Option>
                    {listOfYears.map((year) => (
                        <Select.Option
                            key={year}
                            value={year}
                        >
                            {year}
                        </Select.Option>
                    ))}
                </Select>
                <Select
                    className="select-with-placeholder"
                    name={pageSearchParams.semester}
                    onChange={handleSelectChange}
                    defaultValue={defaultSemester}
                >
                    <Select.Option value="">Semestre</Select.Option>
                    <Select.Option value="1">1º semestre</Select.Option>
                    <Select.Option value="2">2º semestre</Select.Option>
                </Select>
            </Form>
        </Box>
    );
}
