/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EvaluationMethodController } from './../controller/EvaluationMethodController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RepositoryController } from './../controller/RepositoryController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RepositoryMetricsController } from './../controller/RepositoryMetricsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SprintController } from './../controller/SprintController';
import { expressAuthentication } from './../middleware/ExpressAuthentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
            "disabledAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"default":"null","validators":{"isDate":{"errorMsg":"disabledAt must be a Date"}}},
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
            "disabledAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"required":true,"validators":{"isDate":{"errorMsg":"disabledAt must be a Date"}}},
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
            "disabledAt": {"dataType":"union","subSchemas":[{"dataType":"date"},{"dataType":"enum","enums":[null]}],"validators":{"isDate":{"errorMsg":"disabledAt must be a Date"}}},
            "forceDisabled": {"dataType":"boolean","default":"false","validators":{"isBoolean":{"errorMsg":"forceDisabled must be a boolean"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RepositoryDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "evaluationMethod": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}}},
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
    "PaginationResponseDTO_RepositoryDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"refObject","ref":"RepositoryDTO"},"required":true},"totalPages":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllRepositoryQueryDTO": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"integer","validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "filter": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommitMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "totalCommitCount": {"dataType":"double","required":true},
            "commitsPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"commtiPercentage":{"dataType":"double","required":true},"commitCount":{"dataType":"double","required":true},"contribuitor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"string","required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileChangeMetricsDTO": {
        "dataType": "refObject",
        "properties": {
            "totalAdditions": {"dataType":"double","required":true},
            "totalDeletions": {"dataType":"double","required":true},
            "fileChangesPerContributor": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"deletions":{"dataType":"nestedObjectLiteral","nestedProperties":{"percentage":{"dataType":"double","required":true},"sum":{"dataType":"double","required":true}},"required":true},"addtions":{"dataType":"nestedObjectLiteral","nestedProperties":{"percentage":{"dataType":"double","required":true},"sum":{"dataType":"double","required":true}},"required":true},"contribuitor":{"dataType":"nestedObjectLiteral","nestedProperties":{"githubAvatarUrl":{"dataType":"string","required":true},"githubLogin":{"dataType":"string","required":true},"githubName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "start_date": {"dataType":"datetime","required":true},
            "end_date": {"dataType":"datetime","required":true},
            "evaluation_method_id": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "start_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluation_method_id": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluation_method_id must be an integer"}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "start_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","required":true,"validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluation_method_id": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"evaluation_method_id must be an integer"}}},
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
            "page": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"page must be an integer"},"minimum":{"errorMsg":"page must be greater than or equal to 1","value":1}}},
            "limit": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"limit must be an integer"},"minimum":{"errorMsg":"limit must be greater than or equal to 1","value":1}}},
            "start_date": {"dataType":"date","validators":{"isDate":{"errorMsg":"start_date must be a Date"}}},
            "end_date": {"dataType":"date","validators":{"isDate":{"errorMsg":"end_date must be a Date"}}},
            "evaluation_method_id": {"dataType":"integer","validators":{"isInt":{"errorMsg":"evaluation_method_id must be an integer"}}},
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
        app.get('/repository/:repositoryId/metric/commit',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController)),
            ...(fetchMiddlewares<RequestHandler>(RepositoryMetricsController.prototype.getCommitMetrics)),

            function RepositoryMetricsController_getCommitMetrics(request: any, response: any, next: any) {
            const args = {
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"double"},
                    branchName: {"in":"query","name":"branchName","dataType":"string"},
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
                    repositoryId: {"in":"path","name":"repositoryId","required":true,"dataType":"double"},
                    branchName: {"in":"query","name":"branchName","dataType":"string"},
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
        app.post('/sprint',
            authenticateMiddleware([{"bearer":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(SprintController)),
            ...(fetchMiddlewares<RequestHandler>(SprintController.prototype.create)),

            function SprintController_create(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SprintCreateDTO"},
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
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SprintUpdateDTO"},
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
