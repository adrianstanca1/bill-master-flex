export function useOAuthProviders() {
  return {
    providers: ['google', 'github', 'apple', 'okta'],
    enabledProviders: {
      google: true,
      github: true,
      apple: true,
      okta: false,
    },
    loading: false,
    validateProvider: () => true
  };
}