
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { SecurityPolicyHeader } from './SecurityPolicyHeader';
import { SecurityPolicyCard } from './SecurityPolicyCard';

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
  const { logSecurityEvent } = useEnhancedSecurity();

  const updatePolicy = async (policyId: string, updates: Partial<SecurityPolicy>) => {
    setLoading(true);
    try {
      setPolicies(prev => prev.map(policy => 
        policy.id === policyId ? { ...policy, ...updates } : policy
      ));

      // Log security policy change
      logSecurityEvent.mutate({
        action: 'SECURITY_POLICY_UPDATED',
        resourceType: 'security_policy',
        resourceId: policyId,
        details: { policyId, updates }
      });

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
      const defaultPolicies = policies.map(policy => ({
        ...policy,
        enabled: policy.id === 'session_timeout' || policy.id === 'audit_all_actions',
        value: policy.id === 'session_timeout' ? 60 : 
               policy.id === 'password_expiry' ? 90 :
               policy.id === 'data_retention' ? 365 : policy.value
      }));

      setPolicies(defaultPolicies);

      logSecurityEvent.mutate({
        action: 'SECURITY_POLICIES_RESET',
        resourceType: 'security_policy',
        details: { reset_to_defaults: true }
      });

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

  const getSecurityScore = () => {
    const enabledPolicies = policies.filter(p => p.enabled).length;
    const totalPolicies = policies.length;
    return Math.round((enabledPolicies / totalPolicies) * 100);
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      <Card>
        <SecurityPolicyHeader 
          securityScore={securityScore}
          onResetDefaults={resetToDefaults}
          loading={loading}
        />
        <CardContent>
          <div className="grid gap-4">
            {policies.map((policy) => (
              <SecurityPolicyCard
                key={policy.id}
                policy={policy}
                onUpdate={updatePolicy}
                loading={loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
