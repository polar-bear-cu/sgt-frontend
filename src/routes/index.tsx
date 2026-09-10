import { Navigate, useRoutes } from "react-router-dom";
import pages from "~react-pages";
import { PATHS } from "./paths";

export default function AppRoutes() {
  return useRoutes([...pages, { path: "*", element: <Navigate to={PATHS.DASHBOARD} replace /> }]);
}
