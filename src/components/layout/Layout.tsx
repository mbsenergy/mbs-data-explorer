import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 ai-gradient opacity-50" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Animated background shapes */}
        <div className="fixed -top-40 -right-40 w-80 h-80 bg-corporate-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div 
          className="fixed -bottom-40 -left-40 w-80 h-80 bg-corporate-teal rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" 
          style={{ animationDelay: "2s" }} 
        />

        {/* Content */}
        <div className="relative z-10 flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 container py-6 mt-16">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};