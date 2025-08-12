
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RequireAuth } from '@/components/RequireAuth';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useIsMobile } from '@/hooks/use-mobile';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import BusinessManager from '@/pages/BusinessManager';
import Invoices from '@/pages/Invoices';
import Quotes from '@/pages/Quotes';
import Variations from '@/pages/Variations';
import CRM from '@/pages/CRM';
import Advisor from '@/pages/Advisor';
import Agents from '@/pages/Agents';
import Security from '@/pages/Security';
import ToolSetup from '@/pages/ToolSetup';
import AccountSettings from '@/pages/AccountSettings';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {!isMobile && <AppSidebar />}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

function ConditionalSecurityMonitor() {
  const location = useLocation();
  // Hide security UI on home and dashboard, keep active elsewhere
  if (location.pathname === "/" || location.pathname === "/dashboard") return null;
  return <SecurityMonitor />;
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <ConditionalSecurityMonitor />
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
              <Route path="/business-manager" element={<RequireAuth><AppLayout><BusinessManager /></AppLayout></RequireAuth>} />
              <Route path="/invoices" element={<RequireAuth><AppLayout><Invoices /></AppLayout></RequireAuth>} />
              <Route path="/quotes" element={<RequireAuth><AppLayout><Quotes /></AppLayout></RequireAuth>} />
              <Route path="/variations" element={<RequireAuth><AppLayout><Variations /></AppLayout></RequireAuth>} />
              <Route path="/crm" element={<RequireAuth><AppLayout><CRM /></AppLayout></RequireAuth>} />
              <Route path="/advisor" element={<RequireAuth><AppLayout><Advisor /></AppLayout></RequireAuth>} />
              <Route path="/agents" element={<RequireAuth><AppLayout><Agents /></AppLayout></RequireAuth>} />
              <Route path="/security" element={<RequireAuth><AppLayout><Security /></AppLayout></RequireAuth>} />
              <Route path="/tool-setup" element={<RequireAuth><AppLayout><ToolSetup /></AppLayout></RequireAuth>} />
              <Route path="/account-settings" element={<RequireAuth><AppLayout><AccountSettings /></AppLayout></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><AppLayout><Settings /></AppLayout></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
