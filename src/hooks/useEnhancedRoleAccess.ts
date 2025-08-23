import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AppRole = 'admin' | 'manager' | 'employee' | 'readonly';

interface RoleAccessState {
  userRole: AppRole | null;
  loading: boolean;
  canAccessFinancials: boolean;
  canAccessAnalytics: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
  isManager: boolean;
}

export function useEnhancedRoleAccess(): RoleAccessState {
  const [roleState, setRoleState] = useState<RoleAccessState>({
    userRole: null,
    loading: true,
    canAccessFinancials: false,
    canAccessAnalytics: false,
    canManageUsers: false,
    isAdmin: false,
    isManager: false
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRoleState(prev => ({ ...prev, loading: false }));
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('enhanced_role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Failed to fetch user role:', error);
          toast({
            title: "Security Warning",
            description: "Unable to verify user permissions",
            variant: "destructive",
          });
          setRoleState(prev => ({ ...prev, loading: false }));
          return;
        }

        const userRole = profile?.enhanced_role as AppRole || 'employee';
        const isAdmin = userRole === 'admin';
        const isManager = userRole === 'manager';
        const canAccessFinancials = isAdmin || isManager;
        const canAccessAnalytics = isAdmin;
        const canManageUsers = isAdmin;

        setRoleState({
          userRole,
          loading: false,
          canAccessFinancials,
          canAccessAnalytics,
          canManageUsers,
          isAdmin,
          isManager
        });

        // Log role verification for security audit
        await supabase
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            action: 'ROLE_VERIFICATION',
            resource_type: 'authentication',
            details: {
              verified_role: userRole,
              permissions: {
                financials: canAccessFinancials,
                analytics: canAccessAnalytics,
                user_management: canManageUsers
              },
              timestamp: new Date().toISOString()
            }
          });

      } catch (error) {
        console.error('Role access error:', error);
        setRoleState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserRole();

    // Set up auth state listener for role changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchUserRole();
        } else if (event === 'SIGNED_OUT') {
          setRoleState({
            userRole: null,
            loading: false,
            canAccessFinancials: false,
            canAccessAnalytics: false,
            canManageUsers: false,
            isAdmin: false,
            isManager: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  return roleState;
}