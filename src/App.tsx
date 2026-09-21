import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Suspense fallback={<p>loading...</p>}>
              <AppRoutes />
            </Suspense>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
