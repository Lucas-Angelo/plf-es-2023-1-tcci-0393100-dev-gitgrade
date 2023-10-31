import env from "../config/env";

const appRoutes = {
    base: {
        path: "/" as const,
        link() {
            return this.path;
        },

        // necessary to map query string param name per a trustable variable
        search: {
            modal: "modal",
        },
        // necessary to map enum search params per a trustable variable
        searchValues: {
            modal: {
                createEvaluationMethod: "createEvaluationMethod",
                editEvaluationMethod: "editEvaluationMethod",
                linkRepositoryToEvaluationMethod:
                    "linkRepositoryToEvaluationMethod",
                createSprint: "createSprint",
                editSprint: "editSprint",
                createStandardizedIssue: "createStandardizedIssue",
                editStandardizedIssue: "editStandardizedIssue",
                createConsistencyRule: "createConsistencyRule",
                editConsistencyRule: "editConsistencyRule",
            },
        },
    },
    login: {
        path: "login" as const,
        link() {
            return `/${this.path}` as const;
        },
        // necessary to map query string param name per a trustable variable
        search: {
            message: env.oauthFailureSearchParam,
        },
    },
    repo: {
        path: "repo" as const,
        link() {
            return `/${this.path}` as const;
        },

        // nested routes
        list: {
            path: "list" as const,
            link() {
                return `${appRoutes.repo.link()}/${this.path}` as const;
            },
            // necessary to map query string param name per a trustable variable
            search: {
                page: "page",
                filter: "filter",
            },
        },

        detail: {
            path: ":id" as const,
            link(id: number) {
                const path = this.path.replace(":id", id.toString());
                return `${appRoutes.repo.link()}/${path}`;
            },
            params: ["id"] as const,

            // necessary to map query string param name per a trustable variable
            search: {
                branch: "branch",
                startedAt: "startedAt",
                endedAt: "endedAt",
                contributor: "contributor",
                filterWithNoContributor: "filterWithNoContributor",
            },

            getSearchParamsList() {
                return Object.values(this.search);
            },

            //nested routes
            metrics: {
                path: "metrics" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },

                // nested routes
                commits: {
                    path: "commits" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },

                    // nested routes
                    absolute: {
                        path: "absolute" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.commits.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                    percentual: {
                        path: "percentual" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.commits.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                },
                fileTypes: {
                    path: "file-types" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                linesOfCode: {
                    path: "lines-of-code" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },

                    // nested routes
                    addtions: {
                        path: "addtions" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.linesOfCode.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                    deletions: {
                        path: "deletions" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.linesOfCode.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                    relative: {
                        path: "relative" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.linesOfCode.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                },
                fileContributions: {
                    path: "file-contributions" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                commitQuality: {
                    path: "commit-quality" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                issues: {
                    path: "issues" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.metrics.link(id)}/${
                            this.path
                        }`;
                    },

                    // nested routes
                    author: {
                        path: "author" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.issues.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                    assignee: {
                        path: "assignee" as const,
                        link(id: number) {
                            return `${appRoutes.repo.detail.metrics.issues.link(
                                id
                            )}/${this.path}`;
                        },
                    },
                },
            },
            quality: {
                path: "quality" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },
            },
            commits: {
                path: "commits" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },

                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                },
            },
            files: {
                path: "files" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },

                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    path: "path",
                    shouldGetContributors: "shouldGetContributors",
                },
            },
            consistency: {
                path: "consistency" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },

                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    consistencyRuleId: "consistencyRuleId",
                    status: "status",
                    sprint: "sprint",
                },
            },
            config: {
                path: "config" as const,
                link(id: number) {
                    return `${appRoutes.repo.detail.link(id)}/${this.path}`;
                },

                // nested routes
                general: {
                    path: "general" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.config.link(id)}/${
                            this.path
                        }`;
                    },
                },
                branches: {
                    path: "branches" as const,
                    link(id: number) {
                        return `${appRoutes.repo.detail.config.link(id)}/${
                            this.path
                        }`;
                    },

                    // necessary to map query string param name per a trustable variable
                    search: {
                        page: "page",
                    },

                    // nested routes
                    detail: {
                        path: ":branchId" as const,
                        link(id: number, branchId: number) {
                            const path = this.path.replace(
                                ":branchId",
                                branchId.toString()
                            );
                            return `${appRoutes.repo.detail.config.branches.link(
                                id
                            )}/${path}`;
                        },
                        params: ["branchId"] as const,
                        getParams() {
                            return [
                                ...appRoutes.repo.detail.params,
                                ...this.params,
                            ] as const;
                        },
                    },
                },
            },
        },
    },

    evaluationMethod: {
        path: "evaluationMethod" as const,
        link() {
            return `/${this.path}` as const;
        },

        // nested routes
        list: {
            path: "list",
            link() {
                return `${appRoutes.evaluationMethod.link()}/${
                    this.path
                }` as const;
            },

            // necessary to map query string param name per a trustable variable
            search: {
                page: "page",
                description: "description",
            },
        },
        detail: {
            path: ":id" as const,
            link(id: number) {
                const path = this.path.replace(":id", id.toString());
                return `${appRoutes.evaluationMethod.link()}/${path}`;
            },
            params: ["id"] as const,

            // nested routes
            repo: {
                path: "repo" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    filter: "filter",
                },
                // nested routes
                detail: {
                    path: ":repoId" as const,
                    link(id: number, repoId: number) {
                        const path = this.path.replace(
                            ":repoId",
                            repoId.toString()
                        );
                        return `${appRoutes.evaluationMethod.detail.repo.link(
                            id
                        )}/${path}`;
                    },
                    params: ["repoId"] as const,
                    getParams() {
                        return [
                            ...appRoutes.evaluationMethod.detail.params,
                            ...this.params,
                        ] as const;
                    },
                },
            },
            consistencyRule: {
                path: "consistencyRule" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    description: "description",
                },
                // nested routes
                detail: {
                    path: ":consistencyRuleId" as const,
                    link(id: number, consistencyRuleId: number) {
                        const path = this.path.replace(
                            ":consistencyRuleId",
                            consistencyRuleId.toString()
                        );
                        return `${appRoutes.evaluationMethod.detail.consistencyRule.link(
                            id
                        )}/${path}`;
                    },
                    params: ["consistencyRuleId"] as const,
                    getParams() {
                        return [
                            ...appRoutes.evaluationMethod.detail.params,
                            ...this.params,
                        ] as const;
                    },

                    // necessary to map query string param name per a trustable variable
                    search: {
                        id: "id",
                    },
                },
            },
            sprint: {
                path: "sprint" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    name: "name",
                    start_date: "start_date",
                    end_date: "end_date",
                },
                // nested routes
                detail: {
                    path: ":sprintId" as const,
                    link(id: number, sprintId: number) {
                        const path = this.path.replace(
                            ":sprintId",
                            sprintId.toString()
                        );
                        return `${appRoutes.evaluationMethod.detail.sprint.link(
                            id
                        )}/${path}`;
                    },
                    params: ["sprintId"] as const,
                    getParams() {
                        return [
                            ...appRoutes.evaluationMethod.detail.params,
                            ...this.params,
                        ] as const;
                    },

                    // necessary to map query string param name per a trustable variable
                    search: {
                        id: "id",
                    },
                },
            },
            standardizedIssue: {
                path: "standardizedIssue" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
                // necessary to map query string param name per a trustable variable
                search: {
                    page: "page",
                    title: "title",
                },
                // nested routes
                detail: {
                    path: ":standardizedIssueId" as const,
                    link(id: number, standardizedIssueId: number) {
                        const path = this.path.replace(
                            ":standardizedIssueId",
                            standardizedIssueId.toString()
                        );
                        return `${appRoutes.evaluationMethod.detail.standardizedIssue.link(
                            id
                        )}/${path}`;
                    },
                    params: ["standardizedIssueId"] as const,
                    getParams() {
                        return [
                            ...appRoutes.evaluationMethod.detail.params,
                            ...this.params,
                        ] as const;
                    },

                    // necessary to map query string param name per a trustable variable
                    search: {
                        id: "id",
                    },
                },
            },
        },
    },
};

export default appRoutes;
