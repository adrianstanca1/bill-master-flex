export function useOAuthProviders() {
  const oktaEnv =
    (import.meta.env['VITE_ENABLE_OKTA'] as string | undefined) ??
    (import.meta.env['NEXT_PUBLIC_ENABLE_OKTA'] as string | undefined) ??
    process.env.VITE_ENABLE_OKTA ??
    process.env.NEXT_PUBLIC_ENABLE_OKTA ??
    process.env.ENABLE_OKTA;

  const oktaEnabled = typeof oktaEnv === 'string'
    ? ['1', 'true', 'yes'].includes(oktaEnv.toLowerCase())
    : !!oktaEnv;

  return {
    providers: ['google', 'github', 'apple', ...(oktaEnabled ? ['okta'] : [])],
    enabledProviders: {
      google: true,
      github: true,
      apple: true,
      okta: oktaEnabled,
    },
    loading: false,
    validateProvider: () => true,
  };
}