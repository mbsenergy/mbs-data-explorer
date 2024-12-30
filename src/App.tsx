import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { RequireAuth } from "./components/auth/RequireAuth";
import Landing from "./pages/Landing";
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
import DataWrangle from "./pages/DataWrangle";
import Notes from "./pages/Notes";

// Configure the query client with caching settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnMount: false, // Prevent refetch when component mounts
      retry: 1, // Only retry failed requests once
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            
            {/* Protected routes with Layout (including Dashboard) */}
            <Route element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenario" element={<Scenario />} />
              <Route path="/osservatorio" element={<Osservatorio />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/company" element={<Company />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/user" element={<User />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/developer" element={<Developer />} />
              <Route path="/datawrangle" element={<DataWrangle />} />
              <Route path="/notes" element={<Notes />} />
              
              {/* Redirect any unknown routes to dashboard when authenticated */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
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