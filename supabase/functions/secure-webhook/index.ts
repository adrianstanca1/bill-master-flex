import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, webhookId, secretValue, payload } = await req.json();

    switch (action) {
      case 'create_secret': {
        // Generate cryptographically secure secret
        const secret = crypto.randomUUID() + '-' + Date.now();

        // Store encrypted secret
        const { data, error } = await supabase
          .from('webhook_secrets')
          .insert({
            webhook_id: webhookId,
            encrypted_secret: btoa(secret) // Basic encoding - use proper encryption in production
          });

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          secretId: data[0]?.id,
          secret: secret // Only return once for initial setup
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'validate_webhook': {
        const signature = req.headers.get('x-webhook-signature');
        if (!signature) {
          throw new Error('Missing webhook signature');
        }

        // Validate HMAC signature
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(payload));
        
        // Get webhook secret
        const { data: secretData, error: secretError } = await supabase
          .from('webhook_secrets')
          .select('encrypted_secret')
          .eq('webhook_id', webhookId)
          .single();

        if (secretError || !secretData) {
          throw new Error('Invalid webhook configuration');
        }

        const secret = atob(secretData.encrypted_secret);
        const key = await crypto.subtle.importKey(
          'raw',
          encoder.encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign', 'verify']
        );

        const expectedSignature = await crypto.subtle.sign('HMAC', key, data);
        const expectedHex = Array.from(new Uint8Array(expectedSignature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        const providedSignature = signature.replace('sha256=', '');
        
        if (expectedHex !== providedSignature) {
          throw new Error('Invalid webhook signature');
        }

        // Log security event
        await supabase.from('security_audit_log').insert({
          action: 'WEBHOOK_VALIDATED',
          resource_type: 'webhook',
          resource_id: webhookId,
          details: {
            signature_valid: true,
            timestamp: new Date().toISOString()
          }
        });

        return new Response(JSON.stringify({
          success: true,
          validated: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Secure webhook error:', error);
    
    // Log security violation
    await supabase.from('security_audit_log').insert({
      action: 'WEBHOOK_SECURITY_VIOLATION',
      resource_type: 'webhook',
      details: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
