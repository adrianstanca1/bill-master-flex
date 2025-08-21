import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { resend } from '../_shared/resend.ts'
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received auth webhook:', { payload: payload.substring(0, 100) })

    // If webhook secret is not configured, process without verification (for development)
    let webhookData: any
    
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      webhookData = wh.verify(payload, headers)
    } else {
      // For development without webhook secret
      webhookData = JSON.parse(payload)
      console.log('Processing without webhook verification (development mode)')
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = webhookData as {
      user: {
        email: string
        email_confirmed_at?: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log('Processing email for:', user.email, 'Action:', email_action_type)

    // Only send confirmation emails, not other types
    if (email_action_type !== 'signup') {
      console.log('Skipping non-signup email type:', email_action_type)
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const redirectTo = redirect_to || `${supabaseUrl}/dashboard`

    console.log('Rendering email template...')
    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        supabase_url: supabaseUrl,
        token,
        token_hash,
        redirect_to: redirectTo,
        email_action_type,
        user_email: user.email,
      })
    )

    console.log('Sending email via Resend...')
    const { data, error } = await resend.emails.send({
      from: 'Construction Dashboard <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Confirm your email - Construction Dashboard',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: data?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Error in send-confirmation function:', error)
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})