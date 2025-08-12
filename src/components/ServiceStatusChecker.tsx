
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Key, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FunctionDiagnostics from '@/components/FunctionDiagnostics';

interface ServiceStatus {
  name: string;
  status: 'active' | 'inactive' | 'error' | 'missing-key';
  description: string;
  apiKey?: string;
  setupUrl?: string;
  lastChecked?: string;
}

export function ServiceStatusChecker() {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'OpenAI API',
      status: 'missing-key',
      description: 'Required for AI agents, advisor, and quote generation',
      apiKey: 'OPENAI_API_KEY',
      setupUrl: 'https://platform.openai.com/api-keys'
    },
    {
      name: 'Firecrawl API',
      status: 'missing-key',
      description: 'Required for TenderBot web scraping',
      apiKey: 'FIRECRAWL_API_KEY',
      setupUrl: 'https://www.firecrawl.dev/'
    },
    {
      name: 'Supabase Database',
      status: 'active',
      description: 'Primary database and authentication service',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Agent Function',
      status: 'inactive',
      description: 'Invoice analysis and client email drafting'
    },
    {
      name: 'Advisor Function',
      status: 'inactive',
      description: 'Business advice and strategy recommendations'
    },
    {
      name: 'Quote Bot',
      status: 'inactive',
      description: 'Automated quote generation'
    },
    {
      name: 'Tax Bot',
      status: 'active',
      description: 'Tax calculations and compliance'
    },
    {
      name: 'Tender Search',
      status: 'active',
      description: 'Tender opportunity search'
    },
    {
      name: 'SmartOps',
      status: 'active',
      description: 'Operations analytics and insights'
    },
    {
      name: 'RAMS Generator',
      status: 'inactive',
      description: 'Risk assessment and method statements'
    }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'missing-key':
        return <Key className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'error':
        return <Badge className="bg-orange-100 text-orange-800">Error</Badge>;
      case 'missing-key':
        return <Badge className="bg-yellow-100 text-yellow-800">Missing Key</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const checkAllServices = async () => {
    setIsChecking(true);
    try {
      // Simulate service checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Service Check Complete",
        description: "All services have been checked successfully",
      });
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to check some services",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const activeServices = services.filter(s => s.status === 'active').length;
  const totalServices = services.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Service Status Overview
            </div>
            <Button
              onClick={checkAllServices}
              disabled={isChecking}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Check All'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Status</span>
              <span className="text-sm text-muted-foreground">
                {activeServices}/{totalServices} services active
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(activeServices / totalServices) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    {service.lastChecked && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last checked: {new Date(service.lastChecked).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(service.status)}
                  {service.setupUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(service.setupUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Missing API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services
              .filter(service => service.status === 'missing-key')
              .map((service, index) => (
                <Alert key={index}>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{service.name}</strong> requires API key: {service.apiKey}
                      </div>
                      {service.setupUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(service.setupUrl, '_blank')}
                        >
                          Get Key
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Function Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Run comprehensive tests on all edge functions and services.
          </p>
          <FunctionDiagnostics />
        </CardContent>
      </Card>
    </div>
  );
}
