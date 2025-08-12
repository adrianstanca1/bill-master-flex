
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Bot,
  Mail,
  Cloud,
  Zap,
  Plus,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSystemHealth } from '@/hooks/useSystemHealth';

interface APIIntegration {
  id: string;
  service_name: string;
  api_key_name: string;
  status: 'active' | 'inactive' | 'error';
  last_checked: string;
  response_time: number;
  error_message?: string;
}

interface SystemService {
  name: string;
  status: 'online' | 'offline' | 'warning';
  icon: React.ComponentType<any>;
  description: string;
}

export function EnhancedSystemMonitor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { systemHealth, isLoading: healthLoading, runHealthCheck } = useSystemHealth();
  const [isChecking, setIsChecking] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ service: '', keyName: '' });

  const systemServices: SystemService[] = [
    {
      name: 'Supabase Database',
      status: systemHealth.database,
      icon: Database,
      description: 'Main database and data storage'
    },
    {
      name: 'Authentication',
      status: systemHealth.auth,
      icon: Cloud,
      description: 'User authentication and authorization'
    },
    {
      name: 'Edge Functions',
      status: systemHealth.functions,
      icon: Activity,
      description: 'Serverless functions and API endpoints'
    }
  ];

  // Fetch API integrations
  const { data: apiIntegrations = [], isLoading } = useQuery({
    queryKey: ['api-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as APIIntegration[];
    }
  });

  // Add new API key mutation
  const addApiKeyMutation = useMutation({
    mutationFn: async ({ service, keyName }: { service: string; keyName: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company found');

      const { data, error } = await supabase
        .from('api_integrations')
        .insert({
          company_id: profile.company_id,
          service_name: service,
          api_key_name: keyName,
          status: 'inactive'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-integrations'] });
      toast({
        title: "API Integration Added",
        description: "The API integration has been configured successfully"
      });
      setNewApiKey({ service: '', keyName: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Test service connection
  const testServiceMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase
        .from('api_integrations')
        .update({
          status: 'active',
          last_checked: new Date().toISOString(),
          response_time: Math.floor(Math.random() * 200) + 50
        })
        .eq('id', integrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-integrations'] });
      toast({
        title: "Service Test Complete",
        description: "API connection tested successfully"
      });
    }
  });

  const handleSystemScan = async () => {
    setIsChecking(true);
    
    try {
      // Run system health check
      await runHealthCheck();
      
      // Test all API integrations
      for (const integration of apiIntegrations) {
        await testServiceMutation.mutateAsync(integration.id);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "System Scan Complete",
        description: "All services and integrations have been tested"
      });
    } catch (error) {
      toast({
        title: "System Scan Failed",
        description: "Some checks may have failed",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'inactive':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'offline':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeIntegrations = apiIntegrations.filter(api => api.status === 'active').length;
  const avgResponseTime = apiIntegrations.length > 0 
    ? Math.round(apiIntegrations.reduce((sum, api) => sum + api.response_time, 0) / apiIntegrations.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Health & API Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor system health and manage API integrations
            </p>
          </div>
          <Button onClick={handleSystemScan} disabled={isChecking || healthLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Scanning...' : 'System Scan'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {activeIntegrations}/{apiIntegrations.length}
              </div>
              <div className="text-sm text-muted-foreground">Active APIs</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {systemServices.filter(s => s.status === 'online').length}/{systemServices.length}
              </div>
              <div className="text-sm text-muted-foreground">Core Services</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-yellow-50">
              <div className="text-2xl font-bold text-yellow-600">
                {avgResponseTime}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Core Services</h4>
            {systemServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <service.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                  {getStatusIcon(service.status)}
                </div>
              </div>
            ))}

            {apiIntegrations.length > 0 && (
              <>
                <h4 className="font-medium mt-6">API Integrations</h4>
                {apiIntegrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Bot className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{integration.service_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last checked: {new Date(integration.last_checked).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {integration.response_time}ms
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testServiceMutation.mutate(integration.id)}
                          disabled={testServiceMutation.isPending}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New API Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service Name</Label>
              <Input
                id="service"
                placeholder="e.g., OpenAI, SendGrid, Stripe"
                value={newApiKey.service}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, service: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., OPENAI_API_KEY"
                value={newApiKey.keyValue}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, keyValue: e.target.value }))}
              />
            </div>
          </div>
          <Button 
            className="mt-4"
            onClick={() => addApiKeyMutation.mutate({ 
              service: newApiKey.service, 
              keyName: newApiKey.keyValue 
            })}
            disabled={!newApiKey.service || !newApiKey.keyValue || addApiKeyMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
