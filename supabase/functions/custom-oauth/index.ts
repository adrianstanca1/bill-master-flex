import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    console.log('custom-oauth invoked', body);
    
    const action = body?.action || 'info';
    const redirectTo = body?.redirectTo || 'https://example.com/callback';
    
    // Get OAuth credentials from environment
    const clientId = Deno.env.get("OAUTH_CLIENT_ID");
    const clientSecret = Deno.env.get("OAUTH_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ 
        error: "OAuth credentials not configured",
        details: "OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET must be set"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (action === 'authorize') {
      // Generate a secure state parameter
      const state = crypto.randomUUID();
      
      // Store state in a secure way (in production, use proper state storage)
      const authUrl = new URL('https://oauth2.googleapis.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectTo);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid email profile');
      authUrl.searchParams.set('state', state);
      
      console.log('Generated OAuth URL:', authUrl.toString());
      
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'OAuth authorization URL generated',
        url: authUrl.toString(),
        state,
        clientId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (action === 'exchange') {
      const code = body?.code;
      const state = body?.state;
      
      if (!code) {
        return new Response(JSON.stringify({ 
          error: "Authorization code required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectTo,
        }),
      });

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', await tokenResponse.text());
        return new Response(JSON.stringify({ 
          error: "Token exchange failed",
          status: tokenResponse.status
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      const tokenData = await tokenResponse.json();
      
      return new Response(JSON.stringify({ 
        status: 'ok', 
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Default info response
    return new Response(JSON.stringify({ 
      status: 'ok', 
      message: 'Custom OAuth service ready',
      client_id: clientId ? `${clientId.substring(0, 8)}...` : 'not configured',
      available_actions: ['authorize', 'exchange']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    console.error('Custom OAuth error:', e);
    return new Response(JSON.stringify({ 
      error: String(e),
      message: 'Internal server error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});