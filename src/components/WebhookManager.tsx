import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Webhook, Globe, TestTube, Plus, Settings } from 'lucide-react';
import { useCompanyId } from '@/hooks/useCompanyId';

interface WebhookData {
  id: string;
  endpoint_url: string;
  event_type: string;
  is_active: boolean;
  created_at: string;
  last_triggered: string | null;
  retry_count: number;
}

export const WebhookManager: React.FC = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    endpoint_url: '',
    event_type: '',
    secret_key: '',
  });

  const eventTypes = [
    'invoice.created',
    'invoice.updated',
    'quote.created',
    'project.created',
    'task.completed',
    'reminder.due',
  ];

  useEffect(() => {
    if (companyId) {
      loadWebhooks();
    }
  }, [companyId]);

  const loadWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load webhooks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!formData.endpoint_url || !formData.event_type) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('webhooks')
        .insert({
          company_id: companyId,
          endpoint_url: formData.endpoint_url,
          event_type: formData.event_type,
          secret_key: formData.secret_key || crypto.randomUUID(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Webhook created successfully',
      });

      setFormData({ endpoint_url: '', event_type: '', secret_key: '' });
      setShowForm(false);
      loadWebhooks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create webhook',
        variant: 'destructive',
      });
    }
  };

  const toggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Webhook ${isActive ? 'enabled' : 'disabled'}`,
      });

      loadWebhooks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update webhook',
        variant: 'destructive',
      });
    }
  };

  const testWebhook = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('webhook-manager', {
        body: { webhookId: id },
      });

      if (error) throw error;

      toast({
        title: data.success ? 'Success' : 'Test Failed',
        description: data.success 
          ? 'Webhook test completed successfully' 
          : `Test failed: ${data.statusText}`,
        variant: data.success ? 'default' : 'destructive',
      });

      loadWebhooks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to test webhook',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading webhooks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Management
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input
                  id="endpoint"
                  placeholder="https://your-app.com/webhook"
                  value={formData.endpoint_url}
                  onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="event">Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="secret">Secret Key (optional)</Label>
                <Input
                  id="secret"
                  placeholder="Auto-generated if empty"
                  value={formData.secret_key}
                  onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createWebhook}>Create Webhook</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No webhooks configured</p>
              <p className="text-sm">Add your first webhook to get started</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{webhook.event_type}</Badge>
                        <Badge variant={webhook.is_active ? 'default' : 'outline'}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="font-mono text-sm text-muted-foreground">
                        {webhook.endpoint_url}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(webhook.created_at).toLocaleDateString()}
                        {webhook.last_triggered && (
                          <span className="ml-4">
                            Last triggered: {new Date(webhook.last_triggered).toLocaleDateString()}
                          </span>
                        )}
                        {webhook.retry_count > 0 && (
                          <span className="ml-4 text-orange-600">
                            Retry count: {webhook.retry_count}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={webhook.is_active}
                        onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testWebhook(webhook.id)}
                        disabled={!webhook.is_active}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};