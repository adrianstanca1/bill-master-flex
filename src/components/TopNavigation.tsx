
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

  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const lastYRef = React.useRef(0);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(y > 8);
          const goingDown = y > lastYRef.current;
          if (y > 64) {
            setHidden(goingDown);
          } else {
            setHidden(false);
          }
          lastYRef.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true } as AddEventListenerOptions);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll as any);
  }, []);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/site-manager', label: 'Site', icon: Building },
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
    <nav role="navigation" aria-label="Primary" className={`sticky top-0 z-50 border-b border-border px-4 safe-area-top transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'} ${scrolled ? 'bg-surface/90 backdrop-blur shadow-sm py-2' : 'bg-surface py-3'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground hover-scale">ConstructionApp</span>
            </Link>
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar snap-x">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} aria-current={isActive ? 'page' : undefined} title={item.label}>
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
