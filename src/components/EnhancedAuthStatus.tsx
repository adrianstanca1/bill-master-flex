
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Clock, AlertTriangle } from "lucide-react";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";

export default function EnhancedAuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [sessionStrength, setSessionStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const { suspiciousActivity } = useSecurityMonitoring();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
      
      // Evaluate session strength
      if (session) {
        const signInAge = session.user.last_sign_in_at 
          ? Date.now() - new Date(session.user.last_sign_in_at).getTime()
          : Date.now();
        
        const hoursOld = signInAge / (1000 * 60 * 60);
        
        if (hoursOld < 1) {
          setSessionStrength('strong');
        } else if (hoursOld < 24) {
          setSessionStrength('medium');
        } else {
          setSessionStrength('weak');
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLastActivity(session?.user?.last_sign_in_at ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSecureSignOut = async () => {
    // Log the sign-out action
    await supabase.from('security_audit_log').insert({
      action: 'LOGOUT',
      resource_type: 'auth',
      details: { 
        logout_time: new Date().toISOString(),
        user_agent: navigator.userAgent 
      }
    });

    await supabase.auth.signOut();
  };

  const getSessionBadgeColor = () => {
    switch (sessionStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const hasSecurityAlerts = suspiciousActivity && suspiciousActivity.some(alert => alert.type === 'high');

  if (!email) {
    return <Link to="/auth" className="text-sm text-muted-foreground hover:underline">Sign in</Link>;
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-muted-foreground">{email}</span>
        
        <Badge className={getSessionBadgeColor()}>
          <Shield className="h-3 w-3 mr-1" />
          {sessionStrength}
        </Badge>

        {hasSecurityAlerts && (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alert
          </Badge>
        )}

        {lastActivity && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last: {new Date(lastActivity).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to="/security">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Security
          </Button>
        </Link>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSecureSignOut}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
