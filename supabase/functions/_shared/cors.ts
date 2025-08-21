// Secure CORS headers - replace wildcard with specific domains in production
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // TODO: Replace with specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
}