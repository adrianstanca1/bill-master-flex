import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import ToolSetup from "./pages/ToolSetup";
import Setup from "./pages/Setup";
import Auth from "./pages/Auth";
import AuthStatus from "@/components/AuthStatus";
import { RequireAuth } from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <header className="h-12 flex items-center border-b">
            <div className="container mx-auto flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-2" />
                {(() => { try { const s = JSON.parse(localStorage.getItem("as-settings")||"{}"); return s?.logoDataUrl ? (<img src={s.logoDataUrl} alt="Logo" className="h-6 w-auto rounded-sm border" />) : (<span className="text-sm text-muted-foreground">Menu</span>); } catch { return (<span className="text-sm text-muted-foreground">Menu</span>); } })()}
              </div>
              <AuthStatus />
            </div>
          </header>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 container py-6 animate-fade-in">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/invoices" element={<RequireAuth><Invoices /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                <Route path="/tool-setup" element={<RequireAuth><ToolSetup /></RequireAuth>} />
                <Route path="/setup" element={<RequireAuth><Setup /></RequireAuth>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
