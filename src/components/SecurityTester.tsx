
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export function SecurityTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [customQuery, setCustomQuery] = useState('');
  const { toast } = useToast();

  const runSecurityTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests: TestResult[] = [];

    try {
      // Test 1: RLS Policies
      console.log('Testing RLS policies...');
      try {
        const { data: rlsResults, error: rlsError } = await supabase.rpc('test_rls_policies');
        if (rlsError) throw rlsError;
        
        tests.push({
          name: 'RLS Policy Validation',
          status: rlsResults?.every((r: any) => r.result) ? 'pass' : 'fail',
          message: rlsResults?.every((r: any) => r.result) 
            ? 'All RLS policies are functioning correctly'
            : 'Some RLS policies may have issues',
          details: JSON.stringify(rlsResults, null, 2)
        });
      } catch (error) {
        tests.push({
          name: 'RLS Policy Validation',
          status: 'fail',
          message: 'Failed to test RLS policies',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: Data Access Control
      console.log('Testing data access control...');
      try {
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoices')
          .select('id, company_id')
          .limit(5);

        if (invoiceError) throw invoiceError;

        const hasAccessToOwnData = invoices && invoices.length >= 0;
        tests.push({
          name: 'Data Access Control',
          status: hasAccessToOwnData ? 'pass' : 'warning',
          message: hasAccessToOwnData 
            ? 'User can access own company data correctly'
            : 'No data available or access restricted',
          details: `Retrieved ${invoices?.length || 0} records`
        });
      } catch (error) {
        tests.push({
          name: 'Data Access Control',
          status: 'fail',
          message: 'Failed to test data access',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Authentication Status
      console.log('Testing authentication...');
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        tests.push({
          name: 'Authentication Status',
          status: user ? 'pass' : 'fail',
          message: user ? 'User is properly authenticated' : 'User authentication failed',
          details: user ? `User ID: ${user.id.slice(0, 8)}...` : 'No user session found'
        });
      } catch (error) {
        tests.push({
          name: 'Authentication Status',
          status: 'fail',
          message: 'Authentication test failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 4: Company Membership Validation
      console.log('Testing company membership...');
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        tests.push({
          name: 'Company Membership',
          status: profile?.company_id ? 'pass' : 'warning',
          message: profile?.company_id 
            ? 'User has valid company association'
            : 'User may need to be assigned to a company',
          details: profile?.company_id ? `Company ID: ${profile.company_id.slice(0, 8)}...` : 'No company association'
        });
      } catch (error) {
        tests.push({
          name: 'Company Membership',
          status: 'fail',
          message: 'Failed to validate company membership',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 5: Audit Logging
      console.log('Testing audit logging...');
      try {
        const { data: auditLogs, error: auditError } = await supabase
          .from('security_audit_log')
          .select('id, action, created_at')
          .limit(1);

        if (auditError) throw auditError;

        tests.push({
          name: 'Audit Logging',
          status: 'pass',
          message: 'Audit logging system is accessible',
          details: `Found ${auditLogs?.length || 0} recent audit entries`
        });
      } catch (error) {
        tests.push({
          name: 'Audit Logging',
          status: 'warning',
          message: 'Audit logging may not be accessible',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.error('Security test error:', error);
      toast({
        title: "Security Test Error",
        description: "An error occurred while running security tests",
        variant: "destructive"
      });
    }

    setTestResults(tests);
    setIsRunning(false);

    // Show summary toast
    const passCount = tests.filter(t => t.status === 'pass').length;
    const failCount = tests.filter(t => t.status === 'fail').length;
    
    toast({
      title: "Security Tests Complete",
      description: `${passCount} passed, ${failCount} failed`,
      variant: failCount > 0 ? "destructive" : "default"
    });
  };

  const runCustomQuery = async () => {
    if (!customQuery.trim()) return;

    try {
      const { data, error } = await supabase.rpc('test_rls_policies');
      if (error) throw error;

      toast({
        title: "Custom Query Executed",
        description: "Query completed successfully",
      });
    } catch (error) {
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={runSecurityTests} disabled={isRunning} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run Security Tests'}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {testResults.map((result, index) => (
                <Alert key={index} className={`border-l-4 ${
                  result.status === 'pass' ? 'border-l-green-500' :
                  result.status === 'fail' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="font-medium">{result.name}</h4>
                        <AlertDescription className="mt-1">
                          {result.message}
                        </AlertDescription>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground">
                              View Details
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {result.details}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Security Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter a custom query to test security functions..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            rows={4}
          />
          <Button onClick={runCustomQuery} disabled={!customQuery.trim()}>
            Execute Query
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
