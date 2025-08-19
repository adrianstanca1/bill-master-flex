
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Quotes from "./pages/Quotes";
import Expenses from "./pages/Expenses";
import Tools from "./pages/Tools";
import VATSettings from "./pages/VATSettings";
import Projects from "./pages/Projects";
import BusinessManager from "./pages/BusinessManager";
import SiteManager from "./pages/SiteManager";
import CRM from "./pages/CRM";
import Agents from "./pages/Agents";
import Advisor from "./pages/Advisor";
import HR from "./pages/HR";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { OptionalAuth } from "./components/OptionalAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OptionalAuth>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/vat-settings" element={<VATSettings />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/business-manager" element={<BusinessManager />} />
                <Route path="/site-manager" element={<SiteManager />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/advisor" element={<Advisor />} />
                <Route path="/hr" element={<HR />} />
                <Route path="/security" element={<Security />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </SidebarProvider>
        </OptionalAuth>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
