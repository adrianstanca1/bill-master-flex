import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [initialised, setInitialised] = useState(false);
  const [isAuthed, setAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setInitialised(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!initialised) return null;
  if (!isAuthed) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
}
