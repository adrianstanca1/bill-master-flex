
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "next-themes";
import RequireAuth from "@/components/RequireAuth";
import SessionManager from "@/components/SessionManager";
import SecurityMonitor from "@/components/SecurityMonitor";
import ErrorBoundary from "@/components/ErrorBoundary";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Invoices from "@/pages/Invoices";
import Quotes from "@/pages/Quotes";
import BusinessManager from "@/pages/BusinessManager";
import Advisor from "@/pages/Advisor";
import CRM from "@/pages/CRM";
import Variations from "@/pages/Variations";
import Security from "@/pages/Security";
import Settings from "@/pages/Settings";
import Setup from "@/pages/Setup";
import ToolSetup from "@/pages/ToolSetup";
import AccountSettings from "@/pages/AccountSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <SessionManager />
                    <SecurityMonitor />
                    <SidebarProvider>
                      <div className="flex min-h-screen">
                        <AppSidebar />
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/invoices" element={<Invoices />} />
                            <Route path="/quotes" element={<Quotes />} />
                            <Route path="/business-manager" element={<BusinessManager />} />
                            <Route path="/advisor" element={<Advisor />} />
                            <Route path="/crm" element={<CRM />} />
                            <Route path="/variations" element={<Variations />} />
                            <Route path="/security" element={<Security />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/setup" element={<Setup />} />
                            <Route path="/tool-setup" element={<ToolSetup />} />
                            <Route path="/account-settings" element={<AccountSettings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
