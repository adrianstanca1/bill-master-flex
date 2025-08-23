import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield, Users, Database, Lock, Eye, AlertTriangle } from 'lucide-react';

export function SecurityEnhancementPanel() {
  const enhancements = [
    {
      category: "Authentication",
      icon: <Lock className="h-4 w-4" />,
      items: [
        {
          title: "Multi-Factor Authentication",
          description: "Add an extra layer of security with SMS or authenticator apps",
          status: "recommended",
          action: "Configure MFA",
          link: "https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/auth/settings"
        },
        {
          title: "Social Login Providers",
          description: "Enable Google, GitHub, or Microsoft authentication",
          status: "optional",
          action: "Add Providers",
          link: "https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/auth/providers"
        }
      ]
    },
    {
      category: "Access Control",
      icon: <Users className="h-4 w-4" />,
      items: [
        {
          title: "Role-Based Permissions",
          description: "Fine-tune user roles and permissions",
          status: "implemented",
          action: "Review Roles"
        },
        {
          title: "API Rate Limiting",
          description: "Prevent abuse with request rate limiting",
          status: "implemented",
          action: "Monitor Usage"
        }
      ]
    },
    {
      category: "Data Protection",
      icon: <Database className="h-4 w-4" />,
      items: [
        {
          title: "Database Backup Strategy",
          description: "Automated backups and point-in-time recovery",
          status: "recommended",
          action: "Configure Backups",
          link: "https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/database/backups"
        },
        {
          title: "Audit Trail Enhancement",
          description: "Extended audit logging with retention policies",
          status: "implemented",
          action: "Review Policies"
        }
      ]
    },
    {
      category: "Monitoring",
      icon: <Eye className="h-4 w-4" />,
      items: [
        {
          title: "Security Alerts",
          description: "Real-time notifications for security events",
          status: "implemented",
          action: "Configure Alerts"
        },
        {
          title: "Performance Monitoring",
          description: "Track application performance and anomalies",
          status: "recommended",
          action: "Set up Monitoring",
          link: "https://supabase.com/dashboard/project/tjgbyygllssqsywxpxqe/logs/explorer"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Implemented</Badge>;
      case 'recommended':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Recommended</Badge>;
      case 'optional':
        return <Badge variant="outline">Optional</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Enhancement Opportunities
        </CardTitle>
        <CardDescription>
          Additional security measures to further strengthen your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {enhancements.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                {category.icon}
                {category.category}
              </h3>
              <div className="space-y-3 ml-6">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.title}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {item.link ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(item.link, '_blank')}
                        >
                          {item.action}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          {item.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Security Best Practices</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                <li>• Regular security audits and penetration testing</li>
                <li>• Keep dependencies updated and monitor for vulnerabilities</li>
                <li>• Implement proper error handling to avoid information disclosure</li>
                <li>• Use HTTPS everywhere and implement proper CORS policies</li>
                <li>• Regular backup testing and disaster recovery planning</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}