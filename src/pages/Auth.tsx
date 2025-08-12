
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";


export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = (location.state?.from?.pathname as string) || "/dashboard";

  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (session?.user) {
        console.log("User authenticated, checking onboarding status...");
        
        // Check if user has completed onboarding
        const onboarded = (() => { 
          try { 
            return !!(JSON.parse(localStorage.getItem("as-settings") || "{}")?.onboarded); 
          } catch { 
            return false; 
          } 
        })();
        
        // Create or update user profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || ''
              });
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
            } else {
              console.log('User profile created successfully');
            }
          }
        } catch (error) {
          console.error('Error handling user profile:', error);
        }
        
        navigate(onboarded ? redirectTo : "/setup", { replace: true });
      }
    });

    // Check for existing session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
        return;
      }
      
      if (session?.user) {
        console.log("Existing session found, redirecting...");
        const onboarded = (() => { 
          try { 
            return !!(JSON.parse(localStorage.getItem("as-settings") || "{}")?.onboarded); 
          } catch { 
            return false; 
          } 
        })();
        navigate(onboarded ? redirectTo : "/setup", { replace: true });
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast({ 
        title: "Missing information", 
        description: "Please enter both email and password.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { 
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              email: email.trim(),
              first_name: '',
              last_name: ''
            }
          },
        });
        
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({ 
              title: "Account exists", 
              description: "This email is already registered. Try signing in instead.", 
              variant: "destructive" 
            });
            setMode("signin");
          } else {
            throw error;
          }
        } else if (data?.session) {
          toast({ title: "Welcome!", description: "Account created successfully." });
        } else if (data?.user && !data?.session) {
          toast({ 
            title: "Check your email", 
            description: "Please check your email to confirm your account before signing in." 
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password 
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({ 
              title: "Invalid credentials", 
              description: "Please check your email and password and try again.", 
              variant: "destructive" 
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({ 
              title: "Email not confirmed", 
              description: "Please check your email and confirm your account before signing in.", 
              variant: "destructive" 
            });
          } else {
            throw error;
          }
        } else if (data?.session) {
          toast({ title: "Welcome back!", description: "Successfully signed in." });
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      toast({ 
        title: "Authentication error", 
        description: err?.message || "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
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

      <section className="card">
        <form className="grid gap-4" onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input 
              id="email"
              className="input" 
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input 
              id="password"
              className="input" 
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>
          
          <button 
            className="button" 
            type="submit" 
            disabled={loading || !email || !password}
          >
            {loading ? "Please wait…" : (mode === "signin" ? "Sign in" : "Create account")}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {mode === "signin" ? (
            <p className="text-sm">
              Don't have an account?{" "}
              <button 
                className="link font-medium" 
                onClick={()=>setMode("signup")}
              >
                Create one here
              </button>
            </p>
          ) : (
            <p className="text-sm">
              Already have an account?{" "}
              <button 
                className="link font-medium" 
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
