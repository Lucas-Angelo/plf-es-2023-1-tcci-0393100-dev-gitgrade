import {
    Route,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import appRoutes from "../../commom/routes/appRoutes";

import * as BasePageRoute from "../../pages/base";
import ErrorElement from "../../commom/components/errorElement";

const routes = createRoutesFromElements(
    <Route errorElement={<ErrorElement />}>
        <Route
            path={appRoutes.base.path}
            element={<BasePageRoute.Component />}
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
                        path={appRoutes.repo[":id"].path}
                        lazy={() => import("../../pages/repo/detail/index")}
                    >
                        <Route
                            path={appRoutes.repo[":id"].metrics.path}
                            element={<>metrics</>}
                        />
                        <Route
                            path={appRoutes.repo[":id"].quality.path}
                            element={<>quality</>}
                        />
                        <Route
                            path={appRoutes.repo[":id"].commits.path}
                            element={<>commits</>}
                        />
                        <Route
                            path={appRoutes.repo[":id"].consistency.path}
                            element={<>consistency</>}
                        />
                        <Route
                            path={appRoutes.repo[":id"].config.path}
                            element={<>config</>}
                        />

                        <Route
                            path=""
                            element={
                                <Navigate
                                    replace
                                    to={appRoutes.repo[":id"].metrics.path}
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

                <Route path={appRoutes.evaluationMethod.path}>
                    <Route
                        path={appRoutes.evaluationMethod.list.path}
                        lazy={() =>
                            import("../../pages/evaluationMethod/list/index")
                        }
                    />
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
    </Route>
);

const browserRouter = createBrowserRouter(routes);

export default function AppRouter() {
    return <RouterProvider router={browserRouter} />;
}
