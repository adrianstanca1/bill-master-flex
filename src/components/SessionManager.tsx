
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, MapPin, Smartphone, AlertTriangle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionInfo {
  id: string;
  ip: string;
  userAgent: string;
  lastActivity: string;
  location?: string;
  isCurrent: boolean;
}

export function SessionManager() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      // In a real implementation, this would fetch actual session data
      // For now, we'll simulate with current session info
      const mockSessions: SessionInfo[] = [
        {
          id: 'current',
          ip: '192.168.1.100',
          userAgent: navigator.userAgent,
          lastActivity: new Date().toISOString(),
          location: 'London, UK',
          isCurrent: true
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load session information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    if (sessionId === 'current') {
      await supabase.auth.signOut();
      return;
    }

    try {
      // Implement session termination logic
      toast({
        title: "Session terminated",
        description: "The session has been successfully terminated",
      });
      loadSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  const getDeviceType = (userAgent: string) => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'mobile';
    if (/Tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
  };

  const getSessionStrength = (session: SessionInfo) => {
    const hoursSinceActivity = (Date.now() - new Date(session.lastActivity).getTime()) / (1000 * 60 * 60);
    if (hoursSinceActivity < 1) return 'strong';
    if (hoursSinceActivity < 24) return 'medium';
    return 'weak';
  };

  if (loading) {
    return <div className="text-center p-4">Loading sessions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => {
            const deviceType = getDeviceType(session.userAgent);
            const strength = getSessionStrength(session);
            
            return (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">
                      {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Device
                    </span>
                    {session.isCurrent && (
                      <Badge variant="default">Current</Badge>
                    )}
                    <Badge 
                      variant={strength === 'strong' ? 'default' : 
                             strength === 'medium' ? 'secondary' : 'destructive'}
                    >
                      {strength}
                    </Badge>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {session.isCurrent ? 'Sign Out' : 'Terminate'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    IP: {session.ip}
                  </div>
                  {session.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last active: {new Date(session.lastActivity).toLocaleString()}
                  </div>
                </div>
                
                {strength === 'weak' && (
                  <div className="mt-2 flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-xs">Inactive session - consider terminating</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
