
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  Calculator,
  MessageSquare,
  Shield,
  Building,
  PieChart,
  TrendingUp
} from 'lucide-react';

export function TopNavigation() {
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/business-manager', label: 'Business', icon: Building },
    { path: '/advisor', label: 'AI Advisor', icon: MessageSquare },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/quotes', label: 'Quotes', icon: Calculator },
    { path: '/variations', label: 'Variations', icon: TrendingUp },
    { path: '/crm', label: 'CRM', icon: Users },
    { path: '/security', label: 'System Status', icon: Shield },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ConstructionApp</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
