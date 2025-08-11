
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Clock, MapPin, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThreatAlert {
  id: string;
  type: 'brute_force' | 'suspicious_ip' | 'data_exfiltration' | 'privilege_escalation' | 'anomalous_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affectedUser?: string;
  recommendation: string;
}

export function ThreatDetection() {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadThreats();
    const interval = setInterval(loadThreats, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadThreats = async () => {
    try {
      // Simulate threat detection data
      const mockThreats: ThreatAlert[] = [
        {
          id: '1',
          type: 'brute_force',
          severity: 'high',
          title: 'Multiple Failed Login Attempts',
          description: 'Detected 15 failed login attempts from IP 192.168.1.50 in the last 10 minutes',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          source: '192.168.1.50',
          status: 'active',
          recommendation: 'Consider blocking the IP address or implementing rate limiting'
        },
        {
          id: '2',
          type: 'suspicious_ip',
          severity: 'medium',
          title: 'Access from New Geographic Location',
          description: 'User login detected from an unusual location: Moscow, Russia',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: '203.0.113.45',
          status: 'investigating',
          affectedUser: 'john.doe@company.com',
          recommendation: 'Verify with user if this access is legitimate'
        },
        {
          id: '3',
          type: 'anomalous_access',
          severity: 'low',
          title: 'Unusual Activity Pattern',
          description: 'User accessing system outside normal business hours',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: '10.0.0.25',
          status: 'resolved',
          affectedUser: 'admin@company.com',
          recommendation: 'Monitor for continued out-of-hours access'
        }
      ];
      
      setThreats(mockThreats);
    } catch (error) {
      console.error('Failed to load threats:', error);
      toast({
        title: "Error",
        description: "Failed to load threat detection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateThreatStatus = async (threatId: string, status: ThreatAlert['status']) => {
    try {
      setThreats(prev => prev.map(threat => 
        threat.id === threatId ? { ...threat, status } : threat
      ));

      toast({
        title: "Threat status updated",
        description: `Threat marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update threat status",
        variant: "destructive",
      });
    }
  };

  const blockIP = async (ip: string) => {
    try {
      // Implement IP blocking logic
      toast({
        title: "IP Blocked",
        description: `IP address ${ip} has been blocked`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block IP address",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: ThreatAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: ThreatAlert['status']) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'investigating': return 'default';
      case 'resolved': return 'outline';
      case 'false_positive': return 'secondary';
      default: return 'outline';
    }
  };

  const getThreatIcon = (type: ThreatAlert['type']) => {
    switch (type) {
      case 'brute_force': return AlertTriangle;
      case 'suspicious_ip': return MapPin;
      case 'data_exfiltration': return Eye;
      case 'privilege_escalation': return Shield;
      case 'anomalous_access': return Clock;
      default: return AlertTriangle;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading threat detection...</div>;
  }

  const activeThreats = threats.filter(t => t.status === 'active').length;
  const criticalThreats = threats.filter(t => t.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{activeThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{criticalThreats}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Threats</p>
                <p className="text-2xl font-bold">{threats.length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Threat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threats.map((threat) => {
              const IconComponent = getThreatIcon(threat.type);
              
              return (
                <div key={threat.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 mt-0.5 text-destructive" />
                      <div>
                        <h4 className="font-medium">{threat.title}</h4>
                        <p className="text-sm text-muted-foreground">{threat.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusColor(threat.status)}>
                            {threat.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(threat.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div><strong>Source:</strong> {threat.source}</div>
                    {threat.affectedUser && (
                      <div><strong>Affected User:</strong> {threat.affectedUser}</div>
                    )}
                    <div><strong>Recommendation:</strong> {threat.recommendation}</div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {threat.status === 'active' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateThreatStatus(threat.id, 'investigating')}
                        >
                          Investigate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateThreatStatus(threat.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                        {threat.type === 'brute_force' || threat.type === 'suspicious_ip' ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => blockIP(threat.source)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block IP
                          </Button>
                        ) : null}
                      </>
                    )}
                    {threat.status === 'investigating' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateThreatStatus(threat.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateThreatStatus(threat.id, 'false_positive')}
                        >
                          False Positive
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
