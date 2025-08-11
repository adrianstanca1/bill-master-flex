
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { 
  DollarSign, TrendingUp, Users, Calendar, 
  Target, Award, FileText, Shield,
  Building, Briefcase, UserPlus, CheckCircle
} from "lucide-react";
import { HRManager } from "@/components/HRManager";
import { BusinessGrowthAssistant } from "@/components/BusinessGrowthAssistant";
import { ComplianceAssurance } from "@/components/ComplianceAssurance";
import { OperationsScheduler } from "@/components/OperationsScheduler";
import SEO from "@/components/SEO";

const BusinessManager = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000 },
    { month: 'Feb', revenue: 52000, profit: 15000 },
    { month: 'Mar', revenue: 48000, profit: 13500 },
    { month: 'Apr', revenue: 61000, profit: 18000 },
    { month: 'May', revenue: 55000, profit: 16500 },
    { month: 'Jun', revenue: 67000, profit: 20000 },
  ];

  const projectData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#f59e0b' },
    { name: 'Planning', value: 10, color: '#6b7280' },
  ];

  const kpis = [
    {
      title: "Monthly Revenue",
      value: "£67,000",
      change: "+12%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Active Projects",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Building
    },
    {
      title: "Team Members",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Users
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+5%",
      trend: "up",
      icon: Target
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SEO 
        title="Business Manager | Construction Management Platform" 
        description="Comprehensive business management tools for construction companies including analytics, HR, compliance, and growth assistance." 
      />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Manager</h1>
          <p className="text-muted-foreground">
            Comprehensive business management and growth tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Set Goals
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hr">HR Manager</TabsTrigger>
          <TabsTrigger value="growth">Growth Assistant</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={`${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span> from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trends</CardTitle>
                <CardDescription>Monthly performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Current project status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used business management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <UserPlus className="h-6 w-6 mb-2" />
                  Add Employee
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Building className="h-6 w-6 mb-2" />
                  New Project
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Award className="h-6 w-6 mb-2" />
                  Certifications
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Compliance Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr">
          <HRManager />
        </TabsContent>

        <TabsContent value="growth">
          <BusinessGrowthAssistant />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceAssurance />
        </TabsContent>

        <TabsContent value="operations">
          <OperationsScheduler />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed analytics and insights for your construction business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, '']} />
                      <Bar dataKey="revenue" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Project Completion Rate</span>
                        <span className="text-sm">94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Client Satisfaction</span>
                        <span className="text-sm">96%</span>
                      </div>
                      <Progress value={96} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Safety Compliance</span>
                        <span className="text-sm">98%</span>
                      </div>
                      <Progress value={98} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Resource Utilization</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessManager;
