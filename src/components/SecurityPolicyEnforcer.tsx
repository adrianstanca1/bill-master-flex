
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Timer, Eye, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value?: string | number;
  type: 'boolean' | 'number' | 'text';
}

export function SecurityPolicyEnforcer() {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([
    {
      id: 'session_timeout',
      name: 'Session Timeout',
      description: 'Automatically log out users after inactivity (minutes)',
      enabled: true,
      value: 60,
      type: 'number'
    },
    {
      id: 'force_2fa',
      name: 'Force 2FA',
      description: 'Require two-factor authentication for all users',
      enabled: false,
      type: 'boolean'
    },
    {
      id: 'password_expiry',
      name: 'Password Expiry',
      description: 'Force password change every N days',
      enabled: false,
      value: 90,
      type: 'number'
    },
    {
      id: 'ip_whitelist',
      name: 'IP Whitelist',
      description: 'Only allow access from specific IP addresses',
      enabled: false,
      type: 'boolean'
    },
    {
      id: 'audit_all_actions',
      name: 'Audit All Actions',
      description: 'Log all user actions for compliance',
      enabled: true,
      type: 'boolean'
    },
    {
      id: 'data_retention',
      name: 'Data Retention',
      description: 'Automatically delete old data after N days',
      enabled: false,
      value: 365,
      type: 'number'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updatePolicy = async (policyId: string, updates: Partial<SecurityPolicy>) => {
    setLoading(true);
    try {
      setPolicies(prev => prev.map(policy => 
        policy.id === policyId ? { ...policy, ...updates } : policy
      ));

      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Policy updated",
        description: "Security policy has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security policy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = async () => {
    setLoading(true);
    try {
      // Reset all policies to safe defaults
      const defaultPolicies = policies.map(policy => ({
        ...policy,
        enabled: policy.id === 'session_timeout' || policy.id === 'audit_all_actions',
        value: policy.id === 'session_timeout' ? 60 : 
               policy.id === 'password_expiry' ? 90 :
               policy.id === 'data_retention' ? 365 : policy.value
      }));

      setPolicies(defaultPolicies);

      toast({
        title: "Policies reset",
        description: "All security policies have been reset to defaults",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset security policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPolicyIcon = (policyId: string) => {
    switch (policyId) {
      case 'session_timeout': return Timer;
      case 'force_2fa': return Lock;
      case 'password_expiry': return Lock;
      case 'ip_whitelist': return Shield;
      case 'audit_all_actions': return Eye;
      case 'data_retention': return AlertCircle;
      default: return Shield;
    }
  };

  const getSecurityScore = () => {
    const enabledPolicies = policies.filter(p => p.enabled).length;
    const totalPolicies = policies.length;
    return Math.round((enabledPolicies / totalPolicies) * 100);
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Policies
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Security Score</div>
                <div className={`text-lg font-bold ${
                  securityScore >= 80 ? 'text-green-600' :
                  securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {securityScore}%
                </div>
              </div>
              <Button
                variant="outline"
                onClick={resetToDefaults}
                disabled={loading}
              >
                Reset to Defaults
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {policies.map((policy) => {
              const IconComponent = getPolicyIcon(policy.id);
              
              return (
                <div key={policy.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground">{policy.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={(enabled) => updatePolicy(policy.id, { enabled })}
                      disabled={loading}
                    />
                  </div>
                  
                  {policy.enabled && policy.type !== 'boolean' && (
                    <div className="mt-3 flex items-center gap-2">
                      <Label htmlFor={policy.id} className="text-sm">
                        Value:
                      </Label>
                      <Input
                        id={policy.id}
                        type={policy.type === 'number' ? 'number' : 'text'}
                        value={policy.value || ''}
                        onChange={(e) => updatePolicy(policy.id, { 
                          value: policy.type === 'number' ? parseInt(e.target.value) : e.target.value 
                        })}
                        className="w-32"
                        disabled={loading}
                      />
                      {policy.type === 'number' && (
                        <span className="text-xs text-muted-foreground">
                          {policy.id.includes('timeout') ? 'minutes' :
                           policy.id.includes('expiry') || policy.id.includes('retention') ? 'days' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
