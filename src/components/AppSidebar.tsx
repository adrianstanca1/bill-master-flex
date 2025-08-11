import { NavLink, useLocation } from "react-router-dom";
import { Gauge, FileText, Home, Briefcase, Settings as SettingsIcon, Info, Brain, Users, FilePlus2, RefreshCcw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Setup", url: "/setup", icon: SettingsIcon },
  { title: "Dashboard", url: "/dashboard", icon: Gauge },
  { title: "Business Manager", url: "/business-manager", icon: Briefcase },
  { title: "Advisor", url: "/advisor", icon: Brain },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Quotes", url: "/quotes", icon: FilePlus2 },
  { title: "Variations", url: "/variations", icon: RefreshCcw },
  { title: "CRM", url: "/crm", icon: Users },
  { title: "Tenders", url: "/dashboard#tenders", icon: Briefcase },
  { title: "Tool Setup", url: "/tool-setup", icon: Info },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname + (location.hash || "");

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium" : "";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url}>
                    <NavLink to={item.url} end>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
