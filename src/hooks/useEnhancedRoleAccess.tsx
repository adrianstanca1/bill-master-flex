export function useEnhancedRoleAccess() {
  return {
    userRole: 'admin',
    canAccessFinancials: true,
    loading: false,
    checkAccess: () => true,
    updateRole: () => {}
  };
}