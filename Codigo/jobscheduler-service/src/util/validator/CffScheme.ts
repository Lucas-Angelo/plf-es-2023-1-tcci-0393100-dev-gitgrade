import { JSONSchemaType } from "ajv";

interface Author {
    "family-names": string;
    "given-names": string;
    "name-suffix"?: string;
    affiliation?: string;
}

interface Cff {
    "cff-version": string;
    message: string;
    title: string;
    authors: Author[];
    keywords: string[];
    "repository-code": string;
    license: string;
    version: string;
    "date-released": string;
}

const cffScheme: JSONSchemaType<Cff> = {
    type: "object",
    properties: {
        "cff-version": { type: "string" },
        message: { type: "string" },
        title: { type: "string" },
        authors: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    "family-names": { type: "string" },
                    "given-names": { type: "string" },
                    "name-suffix": { type: "string", nullable: true },
                    affiliation: { type: "string", nullable: true },
                },
                required: ["family-names", "given-names"],
            },
            minItems: 1,
        },
        keywords: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
        },
        "repository-code": { type: "string" },
        license: { type: "string" },
        version: { type: "string" },
        "date-released": {
            type: "string",
        },
    },
    required: [
        "cff-version",
        "message",
        "title",
        "authors",
        "keywords",
        "repository-code",
        "license",
        "version",
        "date-released",
    ],
    additionalProperties: false,
};

export default cffScheme;
