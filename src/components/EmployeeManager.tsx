import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  Clock,
  Edit,
  Search,
  Plus
} from 'lucide-react';

interface Employee {
  id: string;
  user_id: string;
  company_id: string;
  role: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export function EmployeeManager() {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  
  const { toast } = useToast();
  const companyId = useCompanyId();
  const queryClient = useQueryClient();

  // Fetch company members
  const { data: employees, isLoading } = useQuery({
    queryKey: ['company-members', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('company_members')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            phone,
            avatar_url
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Employee[];
    },
    enabled: !!companyId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!companyId) return;

    const channel = supabase
      .channel('company-members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company_members',
          filter: `company_id=eq.${companyId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['company-members', companyId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, queryClient]);

  // Invite employee mutation
  const inviteEmployeeMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      // For now, we'll just show a success message
      // In a real implementation, this would send an invitation email
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${data.email} as ${data.role}`,
      });
      return data;
    },
    onSuccess: () => {
      setInviteEmail('');
      setInviteRole('member');
      setViewMode('list');
    },
    onError: (error: any) => {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('company_members')
        .update({ role })
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Role updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    inviteEmployeeMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const filteredEmployees = employees?.filter(employee => {
    const fullName = `${employee.profiles?.first_name || ''} ${employee.profiles?.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  }) || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'member': return 'outline';
      default: return 'outline';
    }
  };

  const getInitials = (employee: Employee) => {
    const firstName = employee.profiles?.first_name || '';
    const lastName = employee.profiles?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  if (!companyId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Please sign in to manage employees</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'add') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Invite Employee
            </CardTitle>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="employee@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={inviteEmployeeMutation.isPending}>
                {inviteEmployeeMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setViewMode('list')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Members
          </CardTitle>
          <Button onClick={() => setViewMode('add')}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Employee
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : filteredEmployees.length > 0 ? (
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(employee)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {employee.profiles?.first_name || 'Unknown'} {employee.profiles?.last_name || 'User'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {employee.profiles?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {employee.profiles.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Joined {new Date(employee.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleColor(employee.role)}>
                      {employee.role}
                    </Badge>
                    <Select 
                      value={employee.role} 
                      onValueChange={(role) => updateRoleMutation.mutate({ userId: employee.user_id, role })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No employees found</p>
            <Button variant="outline" className="mt-3" onClick={() => setViewMode('add')}>
              Invite First Employee
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}