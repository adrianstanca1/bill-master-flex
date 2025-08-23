import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, CheckCircle, Users, Database } from 'lucide-react';
import { useEnhancedRoleAccess } from '@/hooks/useEnhancedRoleAccess';

export function SecurityComplianceDashboard() {
  const { userRole, canAccessFinancials, canAccessAnalytics, isAdmin } = useEnhancedRoleAccess();

  const securityFeatures = [
    {
      title: "Role-Based Access Control",
      status: "active",
      icon: Users,
      description: "Granular permissions based on user roles (admin, manager, employee, readonly)",
      details: [
        "Financial data restricted to admin/manager roles",
        "Analytics access limited to admins",
        "Client access based on project assignments",
        "Enhanced profile access controls"
      ]
    },
    {
      title: "Enhanced Data Protection", 
      status: "active",
      icon: Database,
      description: "Row-Level Security policies protecting sensitive business data",
      details: [
        "Company data isolation enforced",
        "Financial operations audit logging",
        "Automatic privilege validation",
        "Security violation detection"
      ]
    },
    {
      title: "Client-Side Security Hardening",
      status: "active", 
      icon: Shield,
      description: "Browser-based security enhancements and monitoring",
      details: [
        "Content Security Policy with nonce-based scripts",
        "Secure storage with server-side encryption",
        "Legacy localStorage migration",
        "Input validation and sanitization"
      ]
    },
    {
      title: "Session Security Management",
      status: "active",
      icon: Lock,
      description: "Advanced session monitoring and protection",
      details: [
        "24-hour session age limits",
        "30-minute idle timeout",
        "Device fingerprinting",
        "Concurrent session detection"
      ]
    }
  ];

  const getCurrentUserPermissions = () => {
    return [
      { permission: "Financial Data Access", granted: canAccessFinancials },
      { permission: "Analytics Access", granted: canAccessAnalytics },
      { permission: "User Management", granted: isAdmin },
      { permission: "Security Monitoring", granted: isAdmin }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {feature.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                  {feature.description}
                </p>
                <ul className="text-xs space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Your Access Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                Role: {userRole || 'Loading...'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Permissions:</h4>
              {getCurrentUserPermissions().map((perm, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{perm.permission}</span>
                  <Badge variant={perm.granted ? "default" : "secondary"}>
                    {perm.granted ? "Granted" : "Denied"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Security Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Password Protection:</strong> Enable leaked password protection in Supabase Auth settings for enhanced security.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Regular Monitoring:</strong> Review security audit logs regularly to detect unusual patterns.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Role Reviews:</strong> Periodically review user roles and permissions to ensure principle of least privilege.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Access Controls</span>
              <Badge className="bg-green-500">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Client-Side Security</span>
              <Badge className="bg-green-500">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Session Management</span>
              <Badge className="bg-green-500">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Password Protection</span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                Requires Configuration
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}