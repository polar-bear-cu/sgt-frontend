import { Navigate, Outlet, useRoutes, type RouteObject } from "react-router-dom";
import pages from "~react-pages";
import { PATHS, PUBLIC_PATHS } from "./paths";
import RouteGuard from "@/middlewares/RouteGuard";

const isPublic = (route: RouteObject) =>
  route.path !== undefined && PUBLIC_PATHS.includes(`/${route.path}`);

const publicPages = pages.filter(isPublic);
const protectedPages = pages.filter((route) => !isPublic(route));

export default function AppRoutes() {
  return useRoutes([
    ...publicPages,
    {
      element: (
        <RouteGuard>
          <Outlet />
        </RouteGuard>
      ),
      children: protectedPages,
    },
    { path: "*", element: <Navigate to={PATHS.HOME} replace /> },
  ]);
}
