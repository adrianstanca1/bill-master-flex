
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { EmailConfirmationBanner } from "@/components/EmailConfirmationBanner";
import { PasswordSecurityBanner } from "@/components/PasswordSecurityBanner";
import { SecurityConfigChecker } from "@/components/SecurityConfigChecker";
import { useSecurityEnhancements } from "@/hooks/useSecurityEnhancements";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react";

export default function Auth() {
  const { securityStatus } = useSecurityEnhancements();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = (location.state?.from?.pathname as string) || "/dashboard";
  const { isAuthenticated, signIn, signUp, signInWithOAuth, loading: authLoading } = useAuthContext();

  const [mode, setMode] = useState<"signin"|"signup"|"forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Use server-side validation for setup completion
      import('@/components/auth/SecureDataStore').then(({ SecureDataStore }) => {
        SecureDataStore.isSetupComplete().then((isSetupComplete) => {
          navigate(isSetupComplete ? redirectTo : '/setup', { replace: true });
        });
      });
    }
  }, [isAuthenticated, authLoading, navigate, redirectTo]);

  // Check OAuth provider status and handle OAuth sign in
  const checkOAuthProviders = async () => {
    try {
      const { data } = await supabase.rpc('validate_oauth_providers');
      return data;
    } catch (error) {
      console.error('OAuth validation error:', error);
      return { google_enabled: false, microsoft_enabled: false };
    }
  };

  // Enhanced OAuth handler with proper error handling
  const handleOAuthProvider = async (provider: 'google' | 'azure') => {
    setLoading(true);
    try {
      // Check provider availability first
      const providerCheck = await checkOAuthProviders();
      const providerData = providerCheck as { google_enabled?: boolean; microsoft_enabled?: boolean } | null;
      const isEnabled = provider === 'google' ? providerData?.google_enabled : providerData?.microsoft_enabled;
      
      if (!isEnabled) {
        toast({
          title: "Provider Not Available",
          description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is currently not configured. Please use email/password login.`,
          variant: "destructive"
        });
        return;
      }

      const { error } = await signInWithOAuth(provider === 'azure' ? 'azure' : 'google');
      
      if (error) {
        console.error('OAuth error:', error);
        toast({
          title: "OAuth Error",
          description: error.message || "Failed to sign in with OAuth provider. Please try email/password login.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('OAuth error:', err);
      toast({
        title: "OAuth Error",
        description: "An unexpected error occurred during OAuth sign in. Please try email/password login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({ 
        title: "Email required", 
        description: "Please enter your email address.", 
        variant: "destructive" 
      });
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });

        if (error) {
          toast({
            title: "Reset Password Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Reset Email Sent",
            description: "Please check your email for password reset instructions."
          });
          setMode("signin");
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      toast({ 
        title: "Password required", 
        description: "Please enter your password.", 
        variant: "destructive" 
      });
      return;
    }

    if (password.length < 6) {
      toast({ 
        title: "Password too short", 
        description: "Password must be at least 6 characters long.", 
        variant: "destructive" 
      });
      return;
    }

    if (mode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your first and last name.",
          variant: "destructive"
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive"
        });
        return;
      }

      if (!acceptTerms) {
        toast({
          title: "Terms required",
          description: "Please accept the terms and conditions.",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    try {
      let result;
      
      if (mode === "signup") {
        result = await signUp(email, password, { 
          firstName: firstName.trim(), 
          lastName: lastName.trim() 
        });
        
        if (!result.error) {
          setShowEmailConfirmation(true);
          // Log successful signup
          await supabase.from('security_audit_log').insert({
            action: 'USER_SIGNUP_SUCCESS',
            resource_type: 'authentication',
            details: { email, timestamp: new Date().toISOString() }
          });
        } else if (result.error.message.includes("User already registered")) {
          setMode("signin");
          // Log signup attempt with existing email
          await supabase.from('security_audit_log').insert({
            action: 'USER_SIGNUP_EXISTING_EMAIL',
            resource_type: 'authentication',
            details: { email, timestamp: new Date().toISOString() }
          });
        } else {
          // Log failed signup
          await supabase.from('security_audit_log').insert({
            action: 'USER_SIGNUP_FAILED',
            resource_type: 'authentication',
            details: { email, error: result.error.message, timestamp: new Date().toISOString() }
          });
        }
      } else {
        result = await signIn(email, password);
        
        if (!result.error) {
          // Log successful signin
          await supabase.from('security_audit_log').insert({
            action: 'USER_SIGNIN_SUCCESS',
            resource_type: 'authentication',
            details: { email, timestamp: new Date().toISOString() }
          });
        } else {
          // Log failed signin
          await supabase.from('security_audit_log').insert({
            action: 'USER_SIGNIN_FAILED',
            resource_type: 'authentication',
            details: { email, error: result.error.message, timestamp: new Date().toISOString() }
          });
        }
      }
      
    } catch (err: any) {
      console.error("Auth error:", err);
      toast({ 
        title: "Authentication error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend confirmation.",
        variant: "destructive"
      });
      return;
    }

    setIsResendingEmail(true);
    try {
      const result = await signUp(email, password, { 
        firstName: firstName.trim(), 
        lastName: lastName.trim() 
      });
      
      if (!result.error) {
        toast({
          title: "Email sent",
          description: "Check your inbox for the confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsResendingEmail(false);
    }
  }

  return (
    <>
      <main className="container max-w-md mx-auto py-10">
        <SEO 
          title={mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password"} 
          description="Secure authentication for your construction dashboard" 
          noindex 
        />
        
        <SecurityConfigChecker />
        
        {!securityStatus.passwordProtectionEnabled && (
          <PasswordSecurityBanner />
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "signin" && "Sign in to access your construction dashboard"}
            {mode === "signup" && "Join to manage your construction business"}
            {mode === "forgot" && "Enter your email to receive reset instructions"}
          </p>
        </div>

        {showEmailConfirmation && mode === "signup" && (
          <EmailConfirmationBanner 
            onResendEmail={handleResendEmail}
            isResending={isResendingEmail}
          />
        )}

        <div className="elevated-card p-8">
          {mode !== "forgot" && (
            <>
              {/* OAuth Providers */}
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => handleOAuthProvider('google')}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-sm font-medium opacity-60 cursor-not-allowed"
                  disabled={true}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  Continue with Microsoft (Not Configured)
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                    First Name *
                  </label>
                  <input 
                    id="firstName"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    type="text" 
                    placeholder="First name"
                    value={firstName} 
                    onChange={(e)=>setFirstName(e.target.value)} 
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                    Last Name *
                  </label>
                  <input 
                    id="lastName"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    type="text" 
                    placeholder="Last name"
                    value={lastName} 
                    onChange={(e)=>setLastName(e.target.value)} 
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  id="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  required 
                  autoComplete="email"
                />
              </div>
            </div>
            
            {mode !== "forgot" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password *
                  </label>
                  <div className="relative">
                    <input 
                      id="password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "Create a password (min. 6 characters)" : "Enter your password"}
                      value={password} 
                      onChange={(e)=>setPassword(e.target.value)} 
                      required 
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input 
                          id="confirmPassword"
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword} 
                          onChange={(e)=>setConfirmPassword(e.target.value)} 
                          required 
                          autoComplete="new-password"
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I accept the{" "}
                        <a href="/terms" className="text-primary hover:underline" target="_blank">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline" target="_blank">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </>
                )}
              </>
            )}
            
            <Button 
              className="w-full h-12 font-semibold" 
              type="submit" 
              disabled={loading || authLoading || !email.trim() || (mode !== "forgot" && !password)}
            >
              {(loading || authLoading) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === "signin" && "Sign in to your account"}
                  {mode === "signup" && "Create your account"}
                  {mode === "forgot" && "Send reset email"}
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            {mode === "signin" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors" 
                    onClick={()=>setMode("signup")}
                  >
                    Create one here
                  </button>
                </p>
                <p className="text-sm text-muted-foreground">
                  Forgot your password?{" "}
                  <button 
                    className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors" 
                    onClick={()=>setMode("forgot")}
                  >
                    Reset it here
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button 
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors" 
                  onClick={()=>setMode("signin")}
                >
                  Sign in instead
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <button 
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors" 
                  onClick={()=>setMode("signin")}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
