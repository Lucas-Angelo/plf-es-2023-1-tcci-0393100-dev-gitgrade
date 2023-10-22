import {
    Route,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import appRoutes from "../../commom/routes/appRoutes";

import * as BasePageRoute from "../../pages/base";
import * as LoginPageRoute from "../../pages/login";
import ErrorElement from "../../commom/components/errorElement";
import NavigateMaintainingSearchParams from "../../commom/components/navigateMaintainingSearchParams";

const routes = createRoutesFromElements(
    <Route errorElement={<ErrorElement />}>
        <Route
            path={appRoutes.base.path}
            element={<BasePageRoute.Component />}
            loader={BasePageRoute.loader}
        >
            <Route errorElement={<ErrorElement />}>
                <Route
                    path=""
                    element={
                        <Navigate
                            replace
                            to={appRoutes.repo.link()}
                        />
                    }
                />

                <Route path={appRoutes.repo.path}>
                    <Route
                        path={appRoutes.repo.list.path}
                        lazy={() => import("../../pages/repo/list/index")}
                    />
                    <Route
                        path={appRoutes.repo.detail.path}
                        lazy={() => import("../../pages/repo/detail/index")}
                    >
                        <Route
                            path={appRoutes.repo.detail.metrics.path}
                            lazy={() =>
                                import("../../pages/repo/detail/metrics/index")
                            }
                            errorElement={<ErrorElement />}
                        >
                            <Route
                                path={
                                    appRoutes.repo.detail.metrics.commits.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/commits/index"
                                    )
                                }
                            >
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics.commits
                                            .absolute.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/commits/absolute/index"
                                        )
                                    }
                                />
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics.commits
                                            .percentual.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/commits/percentual/index"
                                        )
                                    }
                                />
                                <Route
                                    path=""
                                    element={
                                        <NavigateMaintainingSearchParams
                                            to={
                                                appRoutes.repo.detail.metrics
                                                    .commits.absolute.path
                                            }
                                            replace
                                        />
                                    }
                                />
                            </Route>
                            <Route
                                path={
                                    appRoutes.repo.detail.metrics.fileTypes.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/fileTypes/index"
                                    )
                                }
                            />
                            <Route
                                path={
                                    appRoutes.repo.detail.metrics.linesOfCode
                                        .path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/lines/index"
                                    )
                                }
                            >
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics
                                            .linesOfCode.addtions.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/lines/addtions/index"
                                        )
                                    }
                                />
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics
                                            .linesOfCode.deletions.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/lines/deletions/index"
                                        )
                                    }
                                />
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics
                                            .linesOfCode.relative.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/lines/relative/index"
                                        )
                                    }
                                />
                                <Route
                                    path=""
                                    element={
                                        <NavigateMaintainingSearchParams
                                            to={
                                                appRoutes.repo.detail.metrics
                                                    .linesOfCode.addtions.path
                                            }
                                            replace
                                        />
                                    }
                                />
                            </Route>
                            <Route
                                path={
                                    appRoutes.repo.detail.metrics
                                        .fileContributions.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/fileContributions/index"
                                    )
                                }
                            />
                            <Route
                                path={
                                    appRoutes.repo.detail.metrics.commitQuality
                                        .path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/commitQuality/index"
                                    )
                                }
                            />
                            <Route
                                path={appRoutes.repo.detail.metrics.issues.path}
                                lazy={() =>
                                    import(
                                        "../../pages/repo/detail/metrics/issues/index"
                                    )
                                }
                            >
                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics.issues
                                            .author.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/issues/author/index"
                                        )
                                    }
                                />

                                <Route
                                    path={
                                        appRoutes.repo.detail.metrics.issues
                                            .assignee.path
                                    }
                                    lazy={() =>
                                        import(
                                            "../../pages/repo/detail/metrics/issues/assignee/index"
                                        )
                                    }
                                />

                                <Route
                                    path=""
                                    element={
                                        <NavigateMaintainingSearchParams
                                            to={
                                                appRoutes.repo.detail.metrics
                                                    .issues.author.path
                                            }
                                        />
                                    }
                                />
                            </Route>

                            <Route
                                path=""
                                element={
                                    <NavigateMaintainingSearchParams
                                        replace
                                        to={
                                            appRoutes.repo.detail.metrics
                                                .commits.path
                                        }
                                    />
                                }
                            />
                        </Route>
                        <Route
                            path={appRoutes.repo.detail.quality.path}
                            element={<>quality</>}
                        />
                        <Route
                            path={appRoutes.repo.detail.commits.path}
                            lazy={() =>
                                import("../../pages/repo/detail/commits/index")
                            }
                        />
                        <Route
                            path={appRoutes.repo.detail.consistency.path}
                            element={<>consistency</>}
                        />
                        <Route
                            path={appRoutes.repo.detail.config.path}
                            lazy={() =>
                                import("../../pages/repo/detail/config/index")
                            }
                        />

                        <Route
                            path=""
                            element={
                                <NavigateMaintainingSearchParams
                                    replace
                                    to={appRoutes.repo.detail.metrics.path}
                                />
                            }
                        />
                    </Route>
                    <Route
                        path=""
                        element={
                            <Navigate
                                replace
                                to={appRoutes.repo.list.link()}
                            />
                        }
                    />
                </Route>

                <Route
                    path={appRoutes.evaluationMethod.path}
                    lazy={() => import("../../pages/evaluationMethod/index")}
                >
                    <Route
                        path={appRoutes.evaluationMethod.list.path}
                        lazy={() =>
                            import("../../pages/evaluationMethod/list/index")
                        }
                    />
                    <Route
                        path={appRoutes.evaluationMethod.detail.path}
                        lazy={() =>
                            import("../../pages/evaluationMethod/detail/index")
                        }
                    >
                        <Route
                            path={appRoutes.evaluationMethod.detail.repo.path}
                            lazy={() =>
                                import(
                                    "../../pages/evaluationMethod/detail/repo/index"
                                )
                            }
                        >
                            <Route
                                path={
                                    appRoutes.evaluationMethod.detail.repo
                                        .detail.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/evaluationMethod/detail/repo/detail/index"
                                    )
                                }
                            />
                        </Route>
                        <Route
                            path={
                                appRoutes.evaluationMethod.detail
                                    .consistencyRule.path
                            }
                            lazy={() =>
                                import(
                                    "../../pages/evaluationMethod/detail/consistencyRule/index"
                                )
                            }
                        >
                            <Route
                                path={
                                    appRoutes.evaluationMethod.detail
                                        .consistencyRule.detail.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/evaluationMethod/detail/consistencyRule/detail/index"
                                    )
                                }
                            />
                        </Route>
                        <Route
                            path={appRoutes.evaluationMethod.detail.sprint.path}
                            lazy={() =>
                                import(
                                    "../../pages/evaluationMethod/detail/sprint/index"
                                )
                            }
                        >
                            <Route
                                path={
                                    appRoutes.evaluationMethod.detail.sprint
                                        .detail.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/evaluationMethod/detail/sprint/detail/index"
                                    )
                                }
                            />
                        </Route>
                        <Route
                            path={
                                appRoutes.evaluationMethod.detail
                                    .standardizedIssue.path
                            }
                            lazy={() =>
                                import(
                                    "../../pages/evaluationMethod/detail/standardizedIssue/index"
                                )
                            }
                        >
                            <Route
                                path={
                                    appRoutes.evaluationMethod.detail
                                        .standardizedIssue.detail.path
                                }
                                lazy={() =>
                                    import(
                                        "../../pages/evaluationMethod/detail/standardizedIssue/detail/index"
                                    )
                                }
                            />
                        </Route>
                        <Route
                            path=""
                            element={
                                <Navigate
                                    replace
                                    to={
                                        appRoutes.evaluationMethod.detail.repo
                                            .path
                                    }
                                />
                            }
                        />
                    </Route>
                    <Route
                        path=""
                        element={
                            <Navigate
                                replace
                                to={appRoutes.evaluationMethod.list.link()}
                            />
                        }
                    />
                </Route>
            </Route>
        </Route>

        <Route
            path={appRoutes.login.path}
            element={<LoginPageRoute.Component />}
            loader={LoginPageRoute.loader}
        />
    </Route>
);

const browserRouter = createBrowserRouter(routes);

export default function AppRouter() {
    return <RouterProvider router={browserRouter} />;
}
