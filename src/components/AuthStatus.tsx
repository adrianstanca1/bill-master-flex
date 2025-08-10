import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setEmail(session?.user?.email ?? null));
    return () => subscription.unsubscribe();
  }, []);

  if (!email) {
    return <Link to="/auth" className="text-sm text-muted-foreground hover:underline">Sign in</Link>;
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground hidden sm:inline">{email}</span>
      <button
        className="button-secondary py-1 px-2"
        onClick={() => supabase.auth.signOut()}
      >Sign out</button>
    </div>
  );
}
