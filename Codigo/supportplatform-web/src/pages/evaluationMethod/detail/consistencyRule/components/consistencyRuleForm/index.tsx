import { ConsistencyRuleCreateDTO } from "@gitgrade/dtos";
import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";
import {
    Box,
    Button,
    FormControl,
    Spinner,
    TextInput,
    Text,
    RadioGroup,
    Radio,
    Select,
    Tooltip,
    Octicon,
} from "@primer/react";
import { InfoIcon } from "@primer/octicons-react";
import { useEvaluationMethodSprintList } from "../../../../../../commom/data/sprint";
import { useEvaluationMethodStandardizedIssueList } from "../../../../../../commom/data/standardizedIssue";

interface IConsistencyRuleFormProps {
    submitButtonText?: string;

    isSubmitting?: boolean;
    error?: {
        [key in keyof ConsistencyRuleCreateDTO]?: {
            message: string;
        };
    };

    defaultDescription?: string;
    defaultFilePath?: string;
    defaultSprintId?: number;
    defaultStandardizedIssueId?: number;
    defaultValidationType?: ValidationType;

    evaluationMethodId: number;
}

export default function ConsistencyRuleForm(props: IConsistencyRuleFormProps) {
    const { error } = props;

    const { data: sprintList, isLoading: isLoadingSprints } =
        useEvaluationMethodSprintList(props.evaluationMethodId, {
            limit: 1000,
        });
    const {
        data: standardizedIssueList,
        isLoading: isLoadingStandardizedIssues,
    } = useEvaluationMethodStandardizedIssueList(props.evaluationMethodId, {
        limit: 1000,
    });

    return (
        <>
            <Box
                sx={{
                    mx: 2,
                    border: 0,
                    p: 0,
                }}
                as="fieldset"
                disabled={props.isSubmitting}
            >
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Descrição *</FormControl.Label>
                    <TextInput
                        name="description"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultDescription}
                    />
                    {error?.description && (
                        <FormControl.Validation variant="error">
                            {error.description.message}
                        </FormControl.Validation>
                    )}
                </FormControl>
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Caminho do arquivo</FormControl.Label>
                    <TextInput
                        name="filePath"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultFilePath}
                    />
                    {error?.filePath && (
                        <FormControl.Validation variant="error">
                            {error.filePath.message}
                        </FormControl.Validation>
                    )}
                </FormControl>

                <RadioGroup
                    name="validationType"
                    sx={{ mb: 2 }}
                >
                    <RadioGroup.Label>Validação</RadioGroup.Label>
                    <FormControl>
                        <Radio
                            value={ValidationType.DEFAULT}
                            defaultChecked={
                                !props.defaultValidationType ||
                                props.defaultValidationType ===
                                    ValidationType.DEFAULT
                            }
                        />
                        <FormControl.Label>
                            Padrão
                            <Tooltip
                                wrap
                                aria-label="Valida se o arquivo existe no repositório"
                            >
                                <Octicon
                                    sx={{ ml: 2 }}
                                    icon={InfoIcon}
                                />
                            </Tooltip>
                        </FormControl.Label>
                    </FormControl>
                    <FormControl>
                        <Radio
                            value={ValidationType.CFF}
                            defaultChecked={
                                props.defaultValidationType ===
                                ValidationType.CFF
                            }
                        />
                        <FormControl.Label>
                            Citation File (CFF)
                            <Tooltip
                                wrap
                                aria-label="Valida se o arquivo está no formato CFF, com os dados necessários"
                            >
                                <Octicon
                                    sx={{ ml: 2 }}
                                    icon={InfoIcon}
                                />
                            </Tooltip>
                        </FormControl.Label>
                        {error?.validationType && (
                            <FormControl.Validation variant="error">
                                {error.validationType.message}
                            </FormControl.Validation>
                        )}
                    </FormControl>
                </RadioGroup>

                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Sprint</FormControl.Label>
                    <Select
                        name="sprintId"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultSprintId}
                    >
                        {sprintList?.results.map((sprint) => (
                            <Select.Option
                                key={sprint.id}
                                value={sprint.id.toString()}
                            >
                                {sprint.name}
                            </Select.Option>
                        ))}
                        {isLoadingSprints && (
                            <Select.Option
                                disabled
                                value="___loading___"
                            >
                                Carregando...
                            </Select.Option>
                        )}
                    </Select>
                    {error?.sprintId && (
                        <FormControl.Validation variant="error">
                            {error.sprintId.message}
                        </FormControl.Validation>
                    )}
                </FormControl>
                <FormControl sx={{ mb: 2 }}>
                    <FormControl.Label>Issue padronizada *</FormControl.Label>
                    <Select
                        name="standardizedIssueId"
                        sx={{ width: "100%" }}
                        defaultValue={props.defaultStandardizedIssueId}
                    >
                        <Select.Option value="">Nenhuma</Select.Option>
                        {standardizedIssueList?.results.map(
                            (standardizedIssue) => (
                                <Select.Option
                                    key={standardizedIssue.id}
                                    value={standardizedIssue.id.toString()}
                                    selected={
                                        props.defaultStandardizedIssueId ===
                                        standardizedIssue.id
                                    }
                                >
                                    {standardizedIssue.title}
                                </Select.Option>
                            )
                        )}
                        {isLoadingStandardizedIssues && (
                            <Select.Option
                                disabled
                                value="___loading___"
                            >
                                Carregando...
                            </Select.Option>
                        )}
                    </Select>
                    {error?.standardizedIssueId && (
                        <FormControl.Validation variant="error">
                            {error.standardizedIssueId.message}
                        </FormControl.Validation>
                    )}
                </FormControl>

                <Box
                    sx={{
                        display: "flex",
                        height: "100%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexWrap: "wrap",
                        flexGrow: 1,
                        mt: 4,
                    }}
                >
                    <Text
                        sx={{
                            mr: 2,
                            fontSize: 1,
                        }}
                    >
                        * Opcional
                    </Text>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={props.isSubmitting}
                    >
                        {props.submitButtonText || "Enviar"}
                    </Button>
                </Box>
            </Box>

            {props.isSubmitting && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Spinner size="small" />
                </Box>
            )}
        </>
    );
}
