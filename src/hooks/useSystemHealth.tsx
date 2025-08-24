export function useSystemHealth() {
  return {
    isHealthy: true,
    metrics: {},
    loading: false,
    checkHealth: () => {},
    systemHealth: { status: 'healthy' },
    runHealthCheck: () => {}
  };
}