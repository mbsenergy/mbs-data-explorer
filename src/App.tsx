import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { RequireAuth } from "./components/auth/RequireAuth";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import Analytics from "./pages/Analytics";
import Company from "./pages/Company";
import Settings from "./pages/Settings";
import User from "./pages/User";
import Guide from "./pages/Guide";
import Scenario from "./pages/Scenario";
import Osservatorio from "./pages/Osservatorio";
import Developer from "./pages/Developer";
import DataWrangle from "./pages/Visualize";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              <Route path="scenario" element={<Scenario />} />
              <Route path="osservatorio" element={<Osservatorio />} />
              <Route path="datasets" element={<Datasets />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="company" element={<Company />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user" element={<User />} />
              <Route path="guide" element={<Guide />} />
              <Route path="developer" element={<Developer />} />
              <Route path="datawrangle" element={<DataWrangle />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;