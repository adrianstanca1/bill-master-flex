import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';

export function PasswordSecurityBanner() {
  return (
    <Alert className="border-amber-500 bg-amber-50 max-w-4xl mx-auto mb-4">
      <Shield className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong className="text-amber-800">Password Security Notice</strong>
          <div className="text-amber-700 mt-1 text-sm">
            Enhanced password protection is currently disabled. Enable it in Supabase Authentication settings for better security.
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection', '_blank')}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Learn More
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}