
import React from "react";
import {
  Building2,
  Calculator,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Users,
  Wrench,
  Settings,
  User,
  Briefcase,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import AuthStatus from "@/components/AuthStatus";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: "Overview"
  },
  {
    title: "Business Manager",
    url: "/business-manager",
    icon: Briefcase,
    group: "Business"
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
    group: "Business"
  },
  {
    title: "Quotes",
    url: "/quotes",
    icon: Calculator,
    group: "Business"
  },
  {
    title: "Variations",
    url: "/variations",
    icon: BarChart3,
    group: "Business"
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
    group: "Business"
  },
  {
    title: "AI Advisor",
    url: "/advisor",
    icon: MessageSquare,
    group: "Tools"
  },
  {
    title: "Security",
    url: "/security",
    icon: Shield,
    group: "Tools"
  },
  {
    title: "Tool Setup",
    url: "/tool-setup",
    icon: Wrench,
    group: "Settings"
  },
  {
    title: "Account Settings",
    url: "/account-settings",
    icon: User,
    group: "Settings"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    group: "Settings"
  },
];

const groupedItems = menuItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        {Object.entries(groupedItems).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AuthStatus />
      </SidebarFooter>
    </Sidebar>
  );
}
