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
                        path={appRoutes.repo["detail"].path}
                        element={<div>repo</div>}
                    />
                    <Route
                        path=""
                        element={<Navigate to={appRoutes.repo.list.link()} />}
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
                        />
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
                        />
                        <Route
                            path={appRoutes.evaluationMethod.detail.sprint.path}
                            lazy={() =>
                                import(
                                    "../../pages/evaluationMethod/detail/sprint/index"
                                )
                            }
                        />
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
                        />
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
