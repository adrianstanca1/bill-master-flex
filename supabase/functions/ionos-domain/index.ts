import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const API_URL = "https://api.hosting.ionos.com/v1/domains";

function authHeaders() {
  const prefix = Deno.env.get("IONOS_PUBLIC_PREFIX");
  const secret = Deno.env.get("IONOS_SECRET");
  if (!prefix || !secret) {
    throw new Error("Missing IONOS credentials");
  }
  const token = btoa(`${prefix}:${secret}`);
  return {
    Authorization: `Basic ${token}`,
    Accept: "application/json",
  };
}

serve(async () => {
  try {
    const res = await fetch(API_URL, { headers: authHeaders() });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, status: res.status }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
    const data = await res.json();
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
