
import React from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CISCalculator from "@/components/CISCalculator";
import { 
  FileText, 
  DollarSign, 
  Users, 
  Bell, 
  Shield, 
  Camera, 
  Clock, 
  Calendar,
  BarChart3,
  Target,
  AlertTriangle,
  Truck,
  Wrench,
  FileCheck,
  Zap,
  TrendingUp,
  MapPin,
  Smartphone
} from "lucide-react";

const BusinessManager = () => {
  return (
    <main className="container mx-auto py-6">
      <SEO
        title="Business Manager | AI-Powered Construction Platform"
        description="Comprehensive construction business management with AI automation, compliance tracking, tender discovery, and operational intelligence."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Business Manager",
          applicationCategory: "BusinessApplication",
        }}
        canonical={(typeof window !== "undefined" ? window.location.origin : "") + "/business-manager"}
      />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">AI-Powered Construction Platform</h1>
        <p className="text-text-secondary text-lg">Streamline operations, ensure compliance, and maximize profitability with intelligent automation.</p>
      </header>

      {/* Core Financial Management */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Financial Management
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Create invoices with VAT, retention, and CIS deductions.</p>
              <Link to="/invoices" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Open
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">AI-powered quote generation and conversion tracking.</p>
              <Link to="/quotes" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Open
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Financial Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Cash flow tracking, retention monitoring, and profit analysis.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI-Powered Automation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          AI Automation & Intelligence
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tender Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">AI-powered tender matching and automated bid generation.</p>
              <Link to="/dashboard#tenders" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Open
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Smart RAMS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">AI-generated risk assessments and method statements.</p>
              <span className="text-xs text-muted-foreground">AI-Powered</span>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Compliance Bot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Automated VAT, CIS, and H&S compliance monitoring.</p>
              <span className="text-xs text-muted-foreground">AI-Powered</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Operations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Project Operations
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Timesheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Digital timesheets with GPS tracking and job allocation.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Dayworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Track variations, additional works, and materials.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Site Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">GPS-tagged progress photos with AI analysis.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Digital Tools & Mobility */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Digital Tools & Mobility
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Site Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Mobile workforce management with real-time location tracking.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">AI-scheduled compliance checks, payment reminders, and task alerts.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Asset Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Equipment, materials, and vehicle management with IoT integration.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CRM & Relationships */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          CRM & Client Management
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Client Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Manage clients, contacts, and project relationships.</p>
              <Link to="/crm" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Open
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Project Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-3">Integrated project scheduling with milestone tracking.</p>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CIS Calculator */}
      <section className="mb-8">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              CIS Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CISCalculator />
          </CardContent>
        </Card>
      </section>

      {/* Value Proposition */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Business Impact & Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">70%</div>
            <div className="text-sm text-text-secondary">Time Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">99%</div>
            <div className="text-sm text-text-secondary">Compliance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">15%</div>
            <div className="text-sm text-text-secondary">Cost Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">25%</div>
            <div className="text-sm text-text-secondary">Win Rate Increase</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BusinessManager;
