export function useOAuthProviders() {
  return {
    providers: [],
    enabledProviders: {
      google: false,
      custom: false,
      azure: false
    },
    loading: false,
    validateProvider: () => true
  };
}