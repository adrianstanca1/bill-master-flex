export function useOAuthProviders() {
  return {
    providers: [],
    enabledProviders: [],
    loading: false,
    validateProvider: () => true
  };
}