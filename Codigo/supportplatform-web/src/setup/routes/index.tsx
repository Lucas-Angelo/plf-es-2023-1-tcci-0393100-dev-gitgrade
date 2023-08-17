import {
    Route,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import appRoutes from "../../commom/routes/appRoutes";

import * as BasePageRoute from "../../pages/base";

const routes = createRoutesFromElements(
    <>
        <Route
            path={appRoutes.base.path}
            element={<BasePageRoute.Component />}
        >
            <Route
                path=""
                element={<Navigate to={appRoutes.repo.link()} />}
            />

            <Route path={appRoutes.repo.path}>
                <Route
                    path={appRoutes.repo.list.path}
                    lazy={() => import("../../pages/repo/list/index")}
                />
                <Route
                    path={appRoutes.repo[":id"].path}
                    element={<div>repo</div>}
                />
                <Route
                    path=""
                    element={<Navigate to={appRoutes.repo.list.link()} />}
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
                        <Navigate to={appRoutes.evaluationMethod.list.link()} />
                    }
                />
            </Route>
        </Route>
    </>
);

const browserRouter = createBrowserRouter(routes);

export default function AppRouter() {
    return <RouterProvider router={browserRouter} />;
}
