export function usePasswordSecurity() {
  return {
    passwordStrength: 100,
    isSecure: true,
    checkPassword: () => ({ strength: 100, isSecure: true })
  };
}