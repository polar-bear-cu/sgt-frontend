import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<p>loading...</p>}>
          <AppRoutes />
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
