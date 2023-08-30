const appRoutes = {
    base: {
        path: "/" as const,
        link() {
            return this.path;
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

        ":id": {
            path: ":id" as const,
            link(id: number) {
                const path = this.path.replace(":id", id.toString());
                return `${appRoutes.repo.link()}/${path}`;
            },

            //nested routes
            metrics: {
                path: "metrics" as const,
                link(id: number) {
                    return `${appRoutes.repo[":id"].link(id)}/${this.path}`;
                },

                // nested routes
                commits: {
                    path: "commits" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                fileTypes: {
                    path: "file-types" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                linesOfCode: {
                    path: "lines-of-code" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                fileContributions: {
                    path: "file-contributions" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                commitQuality: {
                    path: "commit-quality" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
                closedIssues: {
                    path: "closed-issues" as const,
                    link(id: number) {
                        return `${appRoutes.repo[":id"].metrics.link(id)}/${
                            this.path
                        }`;
                    },
                },
            },
            quality: {
                path: "quality" as const,
                link(id: number) {
                    return `${appRoutes.repo[":id"].link(id)}/${this.path}`;
                },
            },
            commits: {
                path: "commits" as const,
                link(id: number) {
                    return `${appRoutes.repo[":id"].link(id)}/${this.path}`;
                },
            },
            consistency: {
                path: "consistency" as const,
                link(id: number) {
                    return `${appRoutes.repo[":id"].link(id)}/${this.path}`;
                },
            },
            config: {
                path: "config" as const,
                link(id: number) {
                    return `${appRoutes.repo[":id"].link(id)}/${this.path}`;
                },
            },
        },
    },

    evaluationMethod: {
        path: "eval" as const,
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
        },
    },
};

export default appRoutes;
