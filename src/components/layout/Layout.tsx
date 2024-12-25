import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Navbar />
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};