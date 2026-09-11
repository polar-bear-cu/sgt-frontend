import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Suspense fallback={<p>loading...</p>}>
            <AppRoutes />
          </Suspense>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
