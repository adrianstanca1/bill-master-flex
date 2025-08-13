import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import { RequireAuth } from '@/components/RequireAuth';
import { OptionalAuth } from '@/components/OptionalAuth';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
import { applyUserTheme } from '@/lib/theme';
import SiteManager from '@/pages/SiteManager';
import Projects from '@/pages/Projects';
import HR from '@/pages/HR';
import { TopNavigation } from '@/components/TopNavigation';

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
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <TopNavigation />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function ConditionalSecurityMonitor() {
  const location = useLocation();
  // Hide security UI on home and dashboard, keep active elsewhere
  if (location.pathname === "/" || location.pathname === "/dashboard") return null;
  return <SecurityMonitor />;
}

function App() {
  useEffect(() => { applyUserTheme(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <ConditionalSecurityMonitor />
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<AppLayout><OptionalAuth><Index /></OptionalAuth></AppLayout>} />
              <Route path="/auth" element={<AppLayout><OptionalAuth><Auth /></OptionalAuth></AppLayout>} />
              <Route path="/dashboard" element={<AppLayout><OptionalAuth><Dashboard /></OptionalAuth></AppLayout>} />
              <Route path="/site-manager" element={<AppLayout><OptionalAuth><SiteManager /></OptionalAuth></AppLayout>} />
              <Route path="/business-manager" element={<AppLayout><OptionalAuth><BusinessManager /></OptionalAuth></AppLayout>} />
              <Route path="/invoices" element={<AppLayout><OptionalAuth><Invoices /></OptionalAuth></AppLayout>} />
              <Route path="/quotes" element={<AppLayout><OptionalAuth><Quotes /></OptionalAuth></AppLayout>} />
              <Route path="/variations" element={<AppLayout><OptionalAuth><Variations /></OptionalAuth></AppLayout>} />
              <Route path="/crm" element={<AppLayout><OptionalAuth><CRM /></OptionalAuth></AppLayout>} />
              <Route path="/projects" element={<AppLayout><OptionalAuth><Projects /></OptionalAuth></AppLayout>} />
              <Route path="/hr" element={<AppLayout><OptionalAuth><HR /></OptionalAuth></AppLayout>} />
              <Route path="/advisor" element={<AppLayout><OptionalAuth><Advisor /></OptionalAuth></AppLayout>} />
              <Route path="/agents" element={<AppLayout><OptionalAuth><Agents /></OptionalAuth></AppLayout>} />
              {/* Keep security features behind auth */}
              <Route path="/security" element={<RequireAuth><AppLayout><Security /></AppLayout></RequireAuth>} />
              <Route path="/tool-setup" element={<RequireAuth><AppLayout><ToolSetup /></AppLayout></RequireAuth>} />
              <Route path="/account-settings" element={<RequireAuth><AppLayout><AccountSettings /></AppLayout></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><AppLayout><Settings /></AppLayout></RequireAuth>} />
              <Route path="*" element={<AppLayout><OptionalAuth><NotFound /></OptionalAuth></AppLayout>} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
