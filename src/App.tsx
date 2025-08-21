
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import { SecurityAlert } from "@/components/SecurityAlert";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityHeaders />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SecurityAlert />
        <AuthRedirectHandler />
        <AuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/setup" element={
                  <ProtectedRoute>
                    <Setup />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute requireSetup>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/invoices" element={
                  <ProtectedRoute requireSetup>
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="/quotes" element={
                  <ProtectedRoute requireSetup>
                    <Quotes />
                  </ProtectedRoute>
                } />
                <Route path="/expenses" element={
                  <ProtectedRoute requireSetup>
                    <Expenses />
                  </ProtectedRoute>
                } />
                <Route path="/tools" element={
                  <ProtectedRoute requireSetup>
                    <Tools />
                  </ProtectedRoute>
                } />
                <Route path="/vat-settings" element={
                  <ProtectedRoute requireSetup>
                    <VATSettings />
                  </ProtectedRoute>
                } />
                <Route path="/projects" element={
                  <ProtectedRoute requireSetup>
                    <Projects />
                  </ProtectedRoute>
                } />
                <Route path="/business-manager" element={
                  <ProtectedRoute requireSetup>
                    <BusinessManager />
                  </ProtectedRoute>
                } />
                <Route path="/site-manager" element={
                  <ProtectedRoute requireSetup>
                    <SiteManager />
                  </ProtectedRoute>
                } />
                <Route path="/crm" element={
                  <ProtectedRoute requireSetup>
                    <CRM />
                  </ProtectedRoute>
                } />
                <Route path="/agents" element={
                  <ProtectedRoute requireSetup>
                    <Agents />
                  </ProtectedRoute>
                } />
                <Route path="/advisor" element={
                  <ProtectedRoute requireSetup>
                    <Advisor />
                  </ProtectedRoute>
                } />
                <Route path="/hr" element={
                  <ProtectedRoute requireSetup>
                    <HR />
                  </ProtectedRoute>
                } />
                <Route path="/security" element={
                  <ProtectedRoute requireSetup>
                    <Security />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requireSetup>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
