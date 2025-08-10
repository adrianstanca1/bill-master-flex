import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not set");
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { project } = await req.json();
    if (!project || !project.name) {
      return new Response(JSON.stringify({ error: "project.name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `You are an expert UK construction safety consultant. Generate a professional RAMS (Risk Assessment & Method Statement) as semantic, printable HTML. Use British English, concise language, and include:

- Title block with Project Name, Location, Date
- Project Overview (brief)
- Responsibilities
- Hazard Identification & Control Measures table (Hazard | Risk | Control Measures)
- Method Statement (step-by-step)
- PPE Requirements
- Emergency Procedures
- Residual Risks
- Sign-off section (Supervisor, Date)

Use basic inline CSS for print readability (A4): max-width 800px, readable fonts, headings, table with borders, zebra rows.`;

    const user = {
      role: "user",
      content: [
        { type: "text", text: `Project details: ${JSON.stringify(project)}` },
      ],
    } as const;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        user,
      ],
      temperature: 0.4,
    };

    console.log("Generating RAMS for", project.name);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("OpenAI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const html = data.choices?.[0]?.message?.content || "<p>Could not generate RAMS.</p>";

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("rams function error", error?.message || error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
