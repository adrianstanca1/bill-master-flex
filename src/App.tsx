import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import Advisor from "./pages/Advisor";
import AuthStatus from "@/components/AuthStatus";
import { RequireAuth } from "@/components/RequireAuth";
import Quotes from "./pages/Quotes";
import Variations from "./pages/Variations";
import CRM from "./pages/CRM";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <header className="sticky top-0 z-40 h-12 flex items-center border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-2" />
                {(() => { try { const s = JSON.parse(localStorage.getItem("as-settings")||"{}"); return s?.logoDataUrl ? (<img src={s.logoDataUrl} alt="Logo" className="h-6 w-auto rounded-sm border" />) : (<span className="text-sm text-muted-foreground">Menu</span>); } catch { return (<span className="text-sm text-muted-foreground">Menu</span>); } })()}
              </div>
              <div className="flex-1 hidden md:flex items-center justify-center px-4">
                <input
                  type="search"
                  placeholder="Search invoices, clients, tenders…"
                  aria-label="Global search"
                  className="input w-full max-w-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = (e.currentTarget as HTMLInputElement).value.trim();
                      if (v) {
                        window.history.pushState({}, '', `/dashboard#invoices?q=${encodeURIComponent(v)}`);
                        window.dispatchEvent(new Event('popstate'));
                      }
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard#invoices" className="button">New</Link>
                <AuthStatus />
              </div>
            </div>
          </header>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 container py-6 animate-fade-in">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/advisor" element={<RequireAuth><Advisor /></RequireAuth>} />
                <Route path="/invoices" element={<RequireAuth><Invoices /></RequireAuth>} />
                <Route path="/quotes" element={<RequireAuth><Quotes /></RequireAuth>} />
                <Route path="/variations" element={<RequireAuth><Variations /></RequireAuth>} />
                <Route path="/crm" element={<RequireAuth><CRM /></RequireAuth>} />
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
