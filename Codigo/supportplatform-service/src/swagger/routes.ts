/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BranchController } from './../controller/BranchController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommitController } from './../controller/CommitController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ConsistencyRuleController } from './../controller/ConsistencyRuleController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ConsistencyRuleDeliveryController } from './../controller/ConsistencyRuleDeliveryController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ContributorController } from './../controller/ContributorController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EvaluationMethodController } from './../controller/EvaluationMethodController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RepositoryController } from './../controller/RepositoryController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RepositoryMetricsController } from './../controller/RepositoryMetricsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SprintController } from './../controller/SprintController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StandardizedIssueController } from './../controller/StandardizedIssueController';
import { expressAuthentication } from './../middleware/ExpressAuthentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "BranchDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllBranchQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContributorDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "githubName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "githubEmail": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "githubLogin": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "githubAvatarUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommitResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "message": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "committedDate": {"dataType":"datetime","required":true},
            "branch": {"ref":"BranchDTO","required":true},
            "contributor": {"ref":"ContributorDTO"},
            "sha": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_CommitResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"CommitResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommitSearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "message": {"dataType":"string","validators":{"isString":{"errorMsg":"message must be a string"},"minLength":{"errorMsg":"message must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"message must have a maximum length of 255","value":255}}},
            "startedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"startedAt must be a Date"}}},
            "endedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"endedAt must be a Date"}}},
            "repositoryId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
            "branchName": {"dataType":"string"},
            "contributor": {"dataType":"array","array":{"dataType":"string"}},
            "filterWithNoContributor": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationType": {
        "dataType": "refEnum",
        "enums": ["DEFAULT","CFF"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "evaluationMethodId": {"dataType":"double","required":true},
            "sprintId": {"dataType":"double","required":true},
            "standardizedIssueId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "filePath": {"dataType":"string","required":true},
            "validationType": {"ref":"ValidationType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "sprintId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"sprintId must be an integer"},"minimum":{"errorMsg":"sprintId must be greater than or equal to 1","value":1}}},
            "standardizedIssueId": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"validators":{"isInt":{"errorMsg":"standardizedIssueId must be an integer"},"minimum":{"errorMsg":"standardizedIssueId must be greater than or equal to 1","value":1}}},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"description must have a maximum length of 255","value":255}}},
            "filePath": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"filePath must be a string"},"minLength":{"errorMsg":"filePath must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"filePath must have a maximum length of 10000","value":10000}}},
            "validationType": {"ref":"ValidationType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "sprintId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"sprintId must be an integer"},"minimum":{"errorMsg":"sprintId must be greater than or equal to 1","value":1}}},
            "standardizedIssueId": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"validators":{"isInt":{"errorMsg":"standardizedIssueId must be an integer"},"minimum":{"errorMsg":"standardizedIssueId must be greater than or equal to 1","value":1}}},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"description must have a maximum length of 255","value":255}}},
            "filePath": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"filePath must be a string"},"minLength":{"errorMsg":"filePath must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"filePath must have a maximum length of 10000","value":10000}}},
            "validationType": {"ref":"ValidationType","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_ConsistencyRuleResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"ConsistencyRuleResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleSearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","default":"1","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","default":"10","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "evaluationMethodId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "sprintId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"sprintId must be an integer"},"minimum":{"errorMsg":"sprintId must be greater than or equal to 1","value":1}}},
            "standardizedIssueId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"standardizedIssueId must be an integer"},"minimum":{"errorMsg":"standardizedIssueId must be greater than or equal to 1","value":1}}},
            "description": {"dataType":"string","validators":{"isString":{"errorMsg":"description must be a string"}}},
            "filePath": {"dataType":"string","validators":{"isString":{"errorMsg":"filePath must be a string"}}},
            "validationType": {"ref":"ValidationType"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleDeliveryStatus": {
        "dataType": "refEnum",
        "enums": ["AWAITING_DELIVERY","DELIVERED_ON_TIME","DELIVERED_LATE","NOT_DELIVERED","DELIVERED_WITH_INVALIDITY"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleDeliveryResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "consistencyRuleId": {"dataType":"double","required":true},
            "repositoryId": {"dataType":"double","required":true},
            "deliveryAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"ref":"ConsistencyRuleDeliveryStatus","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleDeliveryCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "consistencyRuleId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"consistencyRuleId must be an integer"},"minimum":{"errorMsg":"consistencyRuleId must be greater than or equal to 1","value":1}}},
            "repositoryId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
            "deliveryAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"validators":{"isDate":{"errorMsg":"deliveryAt must be a Date"}}},
            "status": {"ref":"ConsistencyRuleDeliveryStatus","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleDeliveryUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "consistencyRuleId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"consistencyRuleId must be an integer"},"minimum":{"errorMsg":"consistencyRuleId must be greater than or equal to 1","value":1}}},
            "repositoryId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
            "deliveryAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"validators":{"isDate":{"errorMsg":"deliveryAt must be a Date"}}},
            "status": {"ref":"ConsistencyRuleDeliveryStatus","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_ConsistencyRuleDeliveryResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"ConsistencyRuleDeliveryResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConsistencyRuleDeliverySearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "consistencyRuleId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"consistencyRuleId must be an integer"},"minimum":{"errorMsg":"consistencyRuleId must be greater than or equal to 1","value":1}}},
            "repositoryId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
            "deliveryAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"deliveryAt must be a Date"}}},
            "deliveryAtStart": {"dataType":"date","validators":{"isDate":{"errorMsg":"deliveryAtStart must be a Date"}}},
            "deliveryAtEnd": {"dataType":"date","validators":{"isDate":{"errorMsg":"deliveryAtEnd must be a Date"}}},
            "status": {"ref":"ConsistencyRuleDeliveryStatus"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllContributorQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaluationMethodResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "description": {"dataType":"string","required":true},
            "semester": {"dataType":"double","required":true},
            "year": {"dataType":"double","required":true},
            "disabledAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaluationMethodCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "description": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"description must have a maximum length of 255","value":255}}},
            "semester": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"semester must be an integer"}}},
            "year": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"year must be an integer"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaluationMethodUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "description": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"description must have a maximum length of 255","value":255}}},
            "semester": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"semester must be an integer"}}},
            "year": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"year must be an integer"}}},
            "disabledAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"validators":{"isDate":{"errorMsg":"disabledAt must be a Date"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_EvaluationMethodResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"EvaluationMethodResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaluationMethodSearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","default":"1","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","default":"10","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "description": {"dataType":"string","validators":{"isString":{"errorMsg":"description must be a string"}}},
            "semester": {"dataType":"integer","validators":{"isInt":{"errorMsg":"semester must be an integer"}}},
            "year": {"dataType":"integer","validators":{"isInt":{"errorMsg":"year must be an integer"}}},
            "disabledAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"disabledAt must be a Date"}}},
            "forceDisabled": {"dataType":"boolean","default":"false","validators":{"isBoolean":{"errorMsg":"forceDisabled must be a boolean"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RepositoryResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "evaluationMethod": {"dataType":"union","subSchemas":[{"ref":"EvaluationMethodResponseDTO"},{"dataType":"enum","enums":[null]}]},
            "githubId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "stargazerCount": {"dataType":"double","required":true},
            "forkCount": {"dataType":"double","required":true},
            "githubCreatedAt": {"dataType":"datetime","required":true},
            "githubUpdatedAt": {"dataType":"datetime","required":true},
            "hasProjectsEnabled": {"dataType":"boolean","required":true},
            "hasIssuesEnabled": {"dataType":"boolean","required":true},
            "primaryLanguage": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "licenseName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "defaultBranch": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "automaticSynchronization": {"dataType":"boolean","required":true},
            "synchronizing": {"dataType":"boolean","required":true},
            "lastSyncAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_RepositoryResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"RepositoryResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllRepositoryQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "filter": {"dataType":"string"},
            "evaluationMethodId": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RepositoryPatchDTO": {
        "dataType": "refObject",
        "properties": {
            "evaluationMethodId": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "automaticSynchronization": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommitMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "totalCommitCount": {"dataType":"double","required":true},
            "commitsPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"commtiPercentage":{"dataType":"double","required":true},"commitCount":{"dataType":"double","required":true},"contribuitor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"string","required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}}}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RepositoryMetricQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "startedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"startedAt must be a valid date"}}},
            "endedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"endedAt must be a valid date"}}},
            "branchName": {"dataType":"string"},
            "contributor": {"dataType":"array","array":{"dataType":"string"}},
            "filterWithNoContributor": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileChangeMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "totalAdditions": {"dataType":"double","required":true},
            "totalDeletions": {"dataType":"double","required":true},
            "fileCount": {"dataType":"double","required":true},
            "fileChangesPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"fileCount":{"dataType":"double","required":true},"deletions":{"dataType":"nestedObjectLiteral","nestedProperties":{"percentage":{"dataType":"double","required":true},"sum":{"dataType":"double","required":true}},"required":true},"addtions":{"dataType":"nestedObjectLiteral","nestedProperties":{"percentage":{"dataType":"double","required":true},"sum":{"dataType":"double","required":true}},"required":true},"contribuitor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"string","required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}}}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileTypeMetricDTO": {
        "dataType": "refObject",
        "properties": {
            "count": {"dataType":"double","required":true},
            "extension": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileTypeMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "general": {"dataType":"array","array":{"dataType":"refObject","ref":"FileTypeMetricDTO"},"required":true},
            "perContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"fileTypes":{"dataType":"array","array":{"dataType":"refObject","ref":"FileTypeMetricDTO"},"required":true},"contributor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"id":{"dataType":"double","required":true}}}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "issueDataPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"authoredIssuesCount":{"dataType":"double","required":true},"assignedIssuesCount":{"dataType":"double","required":true},"contributor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"githubLogin":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"githubName":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"id":{"dataType":"double","required":true}}}}},"required":true},
            "issuesOpennedCount": {"dataType":"double","required":true},
            "issuesClosedCount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueMetricQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "startedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"startedAt must be a valid date"}}},
            "endedAt": {"dataType":"date","validators":{"isDate":{"errorMsg":"endedAt must be a valid date"}}},
            "contributor": {"dataType":"array","array":{"dataType":"string"}},
            "filterWithNoContributor": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommitQualityMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "generalCommitQualityLevel": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"qualityLevelCount":{"dataType":"double","required":true},"qualityLevel":{"dataType":"double","required":true}}},"required":true},
            "commitQualityPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"commitQualityLevel":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"qualityLevelCount":{"dataType":"double","required":true},"qualityLevel":{"dataType":"double","required":true}}},"required":true},"contributor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"string","required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}}}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "start_date": {"dataType":"datetime","required":true},
            "end_date": {"dataType":"datetime","required":true},
            "evaluationMethodId": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"name must be a string"},"minLength":{"errorMsg":"name must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"name must have a maximum length of 255","value":255}}},
            "start_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"name must be a string"},"minLength":{"errorMsg":"name must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"name must have a maximum length of 255","value":255}}},
            "start_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_SprintResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"SprintResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintSearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "name": {"dataType":"string","validators":{"isString":{"errorMsg":"name must be a string"},"minLength":{"errorMsg":"name must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"name must have a maximum length of 255","value":255}}},
            "start_date": {"dataType":"date","validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluationMethodId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandardizedIssueResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "evaluationMethodId": {"dataType":"double","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandardizedIssueCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "title": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"title must be a string"},"minLength":{"errorMsg":"title must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"title must have a maximum length of 255","value":255}}},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandardizedIssueUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "evaluationMethodId": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "title": {"dataType":"string","required":true,"validators":{"isString":{"errorMsg":"title must be a string"},"minLength":{"errorMsg":"title must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"title must have a maximum length of 255","value":255}}},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationResponseDTO_StandardizedIssueResponseDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"StandardizedIssueResponseDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandardizedIssueSearchDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","default":"1","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","default":"10","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "evaluationMethodId": {"dataType":"integer","validators":{"isInt":{"errorMsg":"evaluationMethodId must be an integer"},"minimum":{"errorMsg":"evaluationMethodId must be greater than or equal to 1","value":1}}},
            "title": {"dataType":"string","validators":{"isString":{"errorMsg":"title must be a string"},"minLength":{"errorMsg":"title must have a minimum length of 1","value":1},"maxLength":{"errorMsg":"title must have a maximum length of 255","value":255}}},
            "description": {"dataType":"string","validators":{"isString":{"errorMsg":"description must be a string"},"minLength":{"errorMsg":"description must have a minimum length of 1","value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/repository/:repositoryId/branch',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(BranchController)),
            ...(fetchMiddlewares<RequestHandler>(BranchController.prototype.getByRepositoryId)),

            function BranchController_getByRepositoryId(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"double"},
                    query: {"in":"queries","name":"query","required":true,"ref":"GetAllBranchQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BranchController();


              const promise = controller.getByRepositoryId.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/commit',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(CommitController)),
            ...(fetchMiddlewares<RequestHandler>(CommitController.prototype.getAll)),

            function CommitController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"CommitSearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CommitController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/consistency-rule',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController.prototype.create)),

            function ConsistencyRuleController_create(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"ConsistencyRuleCreateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/consistency-rule/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController.prototype.update)),

            function ConsistencyRuleController_update(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"ConsistencyRuleUpdateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/consistency-rule',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController.prototype.getAll)),

            function ConsistencyRuleController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"ConsistencyRuleSearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/consistency-rule/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleController.prototype.getOne)),

            function ConsistencyRuleController_getOne(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleController();


              const promise = controller.getOne.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/consistency-rule-delivery',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController.prototype.create)),

            function ConsistencyRuleDeliveryController_create(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"ConsistencyRuleDeliveryCreateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleDeliveryController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/consistency-rule-delivery/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController.prototype.update)),

            function ConsistencyRuleDeliveryController_update(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"ConsistencyRuleDeliveryUpdateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleDeliveryController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/consistency-rule-delivery',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController.prototype.getAll)),

            function ConsistencyRuleDeliveryController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"ConsistencyRuleDeliverySearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleDeliveryController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/consistency-rule-delivery/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(ConsistencyRuleDeliveryController.prototype.getOne)),

            function ConsistencyRuleDeliveryController_getOne(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ConsistencyRuleDeliveryController();


              const promise = controller.getOne.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/contributor',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(ContributorController)),
            ...(fetchMiddlewares<RequestHandler>(ContributorController.prototype.findbyRepositoryId)),

            function ContributorController_findbyRepositoryId(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"double"},
                    query: {"in":"queries","name":"query","required":true,"ref":"GetAllContributorQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ContributorController();


              const promise = controller.findbyRepositoryId.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/evaluation-method',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController.prototype.create)),

            function EvaluationMethodController_create(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"EvaluationMethodCreateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new EvaluationMethodController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/evaluation-method/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController.prototype.update)),

            function EvaluationMethodController_update(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"EvaluationMethodUpdateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new EvaluationMethodController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/evaluation-method',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController.prototype.getAll)),

            function EvaluationMethodController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"EvaluationMethodSearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new EvaluationMethodController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/evaluation-method/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController.prototype.getOne)),

            function EvaluationMethodController_getOne(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new EvaluationMethodController();


              const promise = controller.getOne.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/evaluation-method/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationMethodController.prototype.delete)),

            function EvaluationMethodController_delete(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new EvaluationMethodController();


              const promise = controller.delete.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 204, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController.prototype.getAll)),

            function RepositoryController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"GetAllRepositoryQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController.prototype.getById)),

            function RepositoryController_getById(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"id must be an integer"},"minimum":{"errorMsg":"id must be greater than or equal to 1","value":1}}},
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryController();


              const promise = controller.getById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/repository/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryController.prototype.patch)),

            function RepositoryController_patch(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"RepositoryPatchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryController();


              const promise = controller.patch.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/metric/commit',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getCommitMetrics)),

            function RepositoryMetricsController_getCommitMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
                    query: {"in":"queries","name":"query","required":true,"ref":"RepositoryMetricQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryMetricsController();


              const promise = controller.getCommitMetrics.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/metric/changes',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getChangesMetrics)),

            function RepositoryMetricsController_getChangesMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
                    query: {"in":"queries","name":"query","required":true,"ref":"RepositoryMetricQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryMetricsController();


              const promise = controller.getChangesMetrics.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/metric/file-types',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getFileTypesMetrics)),

            function RepositoryMetricsController_getFileTypesMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
                    query: {"in":"queries","name":"query","required":true,"ref":"RepositoryMetricQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryMetricsController();


              const promise = controller.getFileTypesMetrics.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/metric/issues',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getIssuesMetrics)),

            function RepositoryMetricsController_getIssuesMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
                    query: {"in":"queries","name":"query","required":true,"ref":"IssueMetricQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryMetricsController();


              const promise = controller.getIssuesMetrics.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/repository/:repositoryId/metric/commit-quality',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getCommitQualityMetrics)),

            function RepositoryMetricsController_getCommitQualityMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"repositoryId must be an integer"},"minimum":{"errorMsg":"repositoryId must be greater than or equal to 1","value":1}}},
                    query: {"in":"queries","name":"query","required":true,"ref":"RepositoryMetricQueryDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RepositoryMetricsController();


              const promise = controller.getCommitQualityMetrics.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sprint',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(SprintController)),
            ...(fetchMiddlewares<RequestHandler>(SprintController.prototype.create)),

            function SprintController_create(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"SprintCreateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SprintController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/sprint/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(SprintController)),
            ...(fetchMiddlewares<RequestHandler>(SprintController.prototype.update)),

            function SprintController_update(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"SprintUpdateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SprintController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sprint',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(SprintController)),
            ...(fetchMiddlewares<RequestHandler>(SprintController.prototype.getAll)),

            function SprintController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"SprintSearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SprintController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sprint/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(SprintController)),
            ...(fetchMiddlewares<RequestHandler>(SprintController.prototype.getOne)),

            function SprintController_getOne(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SprintController();


              const promise = controller.getOne.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/standardized-issue',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController)),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController.prototype.create)),

            function StandardizedIssueController_create(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"StandardizedIssueCreateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new StandardizedIssueController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/standardized-issue/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController)),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController.prototype.update)),

            function StandardizedIssueController_update(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"StandardizedIssueUpdateDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new StandardizedIssueController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/standardized-issue',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController)),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController.prototype.getAll)),

            function StandardizedIssueController_getAll(request: any, response: any, next: any) {
            const args = {
                    query: {"in":"queries","name":"query","required":true,"ref":"StandardizedIssueSearchDTO"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new StandardizedIssueController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/standardized-issue/:id',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController)),
            ...(fetchMiddlewares<RequestHandler>(StandardizedIssueController.prototype.getOne)),

            function StandardizedIssueController_getOne(request: any, response: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new StandardizedIssueController();


              const promise = controller.getOne.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny.call(Promise, secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
