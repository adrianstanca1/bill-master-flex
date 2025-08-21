import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Mail, RefreshCw } from 'lucide-react';

interface EmailConfirmationBannerProps {
  onResendEmail: () => void;
  isResending: boolean;
}

export function EmailConfirmationBanner({ onResendEmail, isResending }: EmailConfirmationBannerProps) {
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 mb-6">
      <Mail className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>
            Please check your email and click the confirmation link to activate your account.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onResendEmail}
          disabled={isResending}
          className="ml-4 border-blue-200 text-blue-800 hover:bg-blue-100"
        >
          {isResending ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend Email'
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}