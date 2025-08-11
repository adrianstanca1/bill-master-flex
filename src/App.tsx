import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RequireAuth } from '@/components/RequireAuth';
import { SessionManager } from '@/components/SessionManager';
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
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <SessionManager />
          <SecurityMonitor />
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/business-manager" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><BusinessManager /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/invoices" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Invoices /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/quotes" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Quotes /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/variations" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Variations /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/crm" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><CRM /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/advisor" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Advisor /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/security" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Security /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/tool-setup" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><ToolSetup /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/account-settings" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><AccountSettings /></div></div></SidebarProvider></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><SidebarProvider><div className="flex"><AppSidebar /><div className="flex-1"><Settings /></div></div></SidebarProvider></RequireAuth>} />
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
