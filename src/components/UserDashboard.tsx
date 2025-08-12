
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle, User } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export function UserDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [sessionStrength, setSessionStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const { suspiciousActivity } = useSecurityMonitoring();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
      
      // Evaluate session strength
      if (session) {
        const signInAge = session.user.last_sign_in_at 
          ? Date.now() - new Date(session.user.last_sign_in_at).getTime()
          : Date.now();
        
        const hoursOld = signInAge / (1000 * 60 * 60);
        
        if (hoursOld < 1) {
          setSessionStrength('strong');
        } else if (hoursOld < 24) {
          setSessionStrength('medium');
        } else {
          setSessionStrength('weak');
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getSessionBadgeColor = () => {
    switch (sessionStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const hasSecurityAlerts = suspiciousActivity && suspiciousActivity.some(alert => alert.type === 'high');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your account and security information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            
            {lastActivity && (
              <div>
                <label className="text-sm font-medium">Last Activity</label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(lastActivity).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Session Strength</label>
              <Badge className={getSessionBadgeColor()}>
                <Shield className="h-3 w-3 mr-1" />
                {sessionStrength}
              </Badge>
            </div>

            {hasSecurityAlerts && (
              <div>
                <label className="text-sm font-medium">Security Status</label>
                <Badge className="bg-red-500">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Security Alert
                </Badge>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Security Events</label>
              <p className="text-sm text-muted-foreground">
                {suspiciousActivity?.length || 0} events in the last hour
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
