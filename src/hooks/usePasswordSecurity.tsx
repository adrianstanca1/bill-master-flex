export function usePasswordSecurity() {
  return {
    passwordStrength: 100,
    isSecure: true,
    validatePasswordStrength: () => ({ strength: 100, isSecure: true }),
    getPasswordStrengthColor: () => 'green',
    isValidating: false,
    checkPassword: () => ({ strength: 100, isSecure: true })
  };
}