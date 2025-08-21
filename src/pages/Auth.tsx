
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { EmailConfirmationBanner } from "@/components/EmailConfirmationBanner";
import { Button } from "@/components/ui/button";
import { Chrome, Github } from 'lucide-react';

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = (location.state?.from?.pathname as string) || "/dashboard";
  const { isAuthenticated, signIn, signUp, signInWithOAuth, loading: authLoading } = useAuthContext();

  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Use server-side validation for setup completion
      import('@/components/SecureStorage').then(({ SecureStorage }) => {
        SecureStorage.isSetupComplete().then((isSetupComplete) => {
          navigate(isSetupComplete ? redirectTo : '/setup', { replace: true });
        });
      });
    }
  }, [isAuthenticated, authLoading, navigate, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast({ 
        title: "Missing information", 
        description: "Please enter both email and password.", 
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

    setLoading(true);
    try {
      let result;
      
      if (mode === "signup") {
        result = await signUp(email, password, { 
          firstName: firstName.trim(), 
          lastName: lastName.trim() 
        });
        
        if (!result.error) {
          // Check if user needs to verify email or can proceed
          // The signUp function handles the toast messages
          setShowEmailConfirmation(true);
        } else if (result.error.message.includes("User already registered")) {
          setMode("signin");
        }
      } else {
        result = await signIn(email, password);
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
      <SEO title={mode === "signin" ? "Sign in" : "Create account"} description="Secure sign in/up for your dashboard" noindex />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "signin" 
            ? "Sign in to access your construction dashboard" 
            : "Join to manage your construction business"
          }
        </p>
      </div>

      {showEmailConfirmation && mode === "signup" && (
        <EmailConfirmationBanner 
          onResendEmail={handleResendEmail}
          isResending={isResendingEmail}
        />
      )}

      <section className="cyber-card p-8">
          <div className="space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => signInWithOAuth('google')}>
              <Chrome className="mr-2 h-4 w-4" /> Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => signInWithOAuth('github')}>
              <Github className="mr-2 h-4 w-4" /> Continue with GitHub
            </Button>
          </div>

          <div className="my-6 text-center relative">
            <span className="absolute inset-0 flex items-center"><span className="w-full border-t" /></span>
            <span className="relative px-2 text-xs text-muted-foreground">or continue with email</span>
          </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <input 
                  id="firstName"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  type="text" 
                  placeholder="First name"
                  value={firstName} 
                  onChange={(e)=>setFirstName(e.target.value)} 
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input 
                  id="lastName"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  type="text" 
                  placeholder="Last name"
                  value={lastName} 
                  onChange={(e)=>setLastName(e.target.value)} 
                  autoComplete="family-name"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <input 
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input 
              id="password"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              type="password" 
              placeholder={mode === "signup" ? "Create a password (min. 6 characters)" : "Enter your password"}
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>
          
          <button 
            className="btn-neon w-full py-3 px-6 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit" 
            disabled={loading || authLoading || !email.trim() || !password}
          >
            {(loading || authLoading) ? "Please wait…" : (mode === "signin" ? "Sign in" : "Create account")}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {mode === "signin" ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button 
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors" 
                onClick={()=>setMode("signup")}
              >
                Create one here
              </button>
            </p>
          ) : (
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
        </div>
      </section>
    </main>
    </>
  );
}
