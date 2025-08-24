export function useEnhancedRoleAccess() {
  return {
    userRole: 'admin',
    canAccessFinancials: true,
    canAccessAnalytics: true,
    isAdmin: true,
    loading: false,
    checkAccess: () => true,
    updateRole: () => {}
  };
}