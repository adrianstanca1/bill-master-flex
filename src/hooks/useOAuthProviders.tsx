export function useOAuthProviders() {
  return {
    providers: [],
    loading: false,
    validateProvider: () => true
  };
}