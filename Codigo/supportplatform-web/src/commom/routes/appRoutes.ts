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
            message: "message",
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
            },
            sprint: {
                path: "sprint" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
            },
            standardizedIssue: {
                path: "standardizedIssue" as const,
                link(id: number) {
                    return `${appRoutes.evaluationMethod.detail.link(id)}/${
                        this.path
                    }`;
                },
            },
        },
    },
};

export default appRoutes;
