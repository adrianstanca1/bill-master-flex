
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users, Clock, Settings, LogOut } from 'lucide-react';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { useToast } from '@/hooks/use-toast';

export function SessionManager() {
  const { toast } = useToast();
  const [sessionConfig, setSessionConfig] = useState({
    timeoutMinutes: 60,
    warningMinutes: 5,
    enableWarning: true,
    maxConcurrentSessions: 3
  });

  const sessionManagement = useSessionManagement({
    timeoutMinutes: sessionConfig.timeoutMinutes,
    warningMinutes: sessionConfig.warningMinutes,
    enableWarning: sessionConfig.enableWarning
  });

  const [activeSessions] = useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'London, UK',
      ip: '192.168.1.100',
      lastActivity: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'London, UK',
      ip: '192.168.1.101',
      lastActivity: '1 hour ago',
      current: false
    }
  ]);

  const handleConfigUpdate = () => {
    toast({
      title: "Session Settings Updated",
      description: "New session configuration has been applied",
    });
  };

  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Session Terminated",
      description: `Session ${sessionId} has been terminated`,
    });
  };

  const getTimeRemaining = () => {
    const remaining = sessionManagement.getTimeUntilExpiry();
    const minutes = Math.floor(remaining / (1000 * 60));
    return `${minutes} minutes`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${session.current ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className="font-medium">{session.device}</h4>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                    <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                    <p className="text-xs text-muted-foreground">Last activity: {session.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.current && <Badge className="bg-green-100 text-green-800">Current</Badge>}
                  {!session.current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Terminate
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
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Timeout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{getTimeRemaining()}</div>
              <div className="text-sm text-muted-foreground">Until session expires</div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeout">Timeout (minutes)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={sessionConfig.timeoutMinutes}
                    onChange={(e) => setSessionConfig(prev => ({
                      ...prev,
                      timeoutMinutes: parseInt(e.target.value) || 60
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="warning">Warning (minutes)</Label>
                  <Input
                    id="warning"
                    type="number"
                    value={sessionConfig.warningMinutes}
                    onChange={(e) => setSessionConfig(prev => ({
                      ...prev,
                      warningMinutes: parseInt(e.target.value) || 5
                    }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-warning"
                  checked={sessionConfig.enableWarning}
                  onCheckedChange={(checked) => setSessionConfig(prev => ({
                    ...prev,
                    enableWarning: checked
                  }))}
                />
                <Label htmlFor="enable-warning">Enable session warnings</Label>
              </div>
              
              <Button onClick={handleConfigUpdate} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Update Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Force logout on suspicious activity</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span>Limit concurrent sessions</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span>Two-factor authentication required</span>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <span>Log all session activities</span>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
