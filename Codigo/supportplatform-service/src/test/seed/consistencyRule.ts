import {
    IConsistencyRuleAttributes,
    ValidationType,
} from "../../model/ConsistencyRule";

const consistencyRuleTestingSeed: IConsistencyRuleAttributes[] = [
    {
        id: 1,
        evaluationMethodId: 13,
        sprintId: 6,
        standardizedIssueId: null,
        description: "Consistency Rule 1 for DocumentoDeRequisitos.docx",
        filePath: "Documentacao/DocumentoDeRequisitos.docx",
        validationType: ValidationType.DEFAULT,
    },
    {
        id: 2,
        evaluationMethodId: 13,
        sprintId: 6,
        standardizedIssueId: null,
        description: "Consistency Rule 2 for DocumentoDaArquitetura.docx",
        filePath: "CITANTION.cff",
        validationType: ValidationType.CFF,
    },
    {
        id: 3,
        evaluationMethodId: 13,
        sprintId: 7,
        standardizedIssueId: null,
        description: "Consistency Rule 3 for DocumentoDaArquitetura.docx",
        filePath: "Documentacao/DocumentoDaArquitetura.docx",
        validationType: ValidationType.DEFAULT,
    },
    {
        id: 4,
        evaluationMethodId: 13,
        sprintId: 8,
        standardizedIssueId: null,
        description: "Consistency Rule 4 for DocumentoDaArquitetura.docx",
        filePath: "Documentacao/DocumentoDoProjeto.md",
        validationType: ValidationType.DEFAULT,
    },
    {
        id: 5,
        evaluationMethodId: 14,
        sprintId: 11,
        standardizedIssueId: null,
        description: "Consistency Rule 5 for DocumentoDaArquitetura.docx",
        filePath: "Documentacao/DocumentoDoProjeto.md",
        validationType: ValidationType.DEFAULT,
    },
    {
        id: 6,
        evaluationMethodId: 14,
        sprintId: 11,
        standardizedIssueId: null,
        description: "Consistency Rule 6 for DocumentoDaArquitetura.docx",
        filePath: "Documentacao/DocumentoDoProjeto.md",
        validationType: ValidationType.DEFAULT,
    },
];

export { consistencyRuleTestingSeed };
