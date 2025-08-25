// Get environment-specific CORS origin for enhanced security
const getAllowedOrigin = () => {
  const envRef = Deno.env.get('SUPABASE_PROJECT_REF');
  let derivedRef = '';
  const url = Deno.env.get('SUPABASE_URL');
  if (!envRef && url) {
    try {
      derivedRef = new URL(url).hostname.split('.')[0];
    } catch {
      derivedRef = '';
    }
  }
  const projectRef = envRef || derivedRef;

  const allowedOrigins = [
    'https://lovable.dev',
    projectRef ? `https://${projectRef}.supabase.co` : '',
    'https://project.lovable.app',
  ].filter(Boolean);

  // In production, restrict to specific domains only
  return allowedOrigins.join(', ');
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': getAllowedOrigin(),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
};