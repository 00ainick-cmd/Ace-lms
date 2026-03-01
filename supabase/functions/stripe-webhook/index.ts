// supabase/functions/stripe-webhook/index.ts
// Receives Stripe checkout.session.completed, creates enrollment row

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Map Stripe Price IDs to plan config
const PRICE_MAP: Record<string, { plan: string; expiresInDays: number | null; amount: number }> = {
  'price_LIFETIME_CAET_ENTRY': { plan: 'lifetime', expiresInDays: null, amount: 347 },
  'price_ANNUAL_CAET_ENTRY':   { plan: 'annual', expiresInDays: 365, amount: 197 },
  'price_AET_GAP_PREP':        { plan: 'lifetime', expiresInDays: null, amount: 97 },
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusing O/0/I/1
  const segment = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `ACE-${segment(4)}-${segment(4)}`
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Bad signature', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('OK', { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const email = session.customer_details?.email ?? session.customer_email ?? null
  const priceId = session.line_items?.data?.[0]?.price?.id ?? null
  const planConfig = priceId ? PRICE_MAP[priceId] : null

  if (!planConfig) {
    console.error('Unknown price ID:', priceId)
    return new Response('Unknown price', { status: 400 })
  }

  // Generate a unique code (retry if collision — extremely unlikely)
  let code = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateCode()
    const { data: existing } = await supabase
      .from('ace_enrollments')
      .select('id')
      .eq('access_code', code)
      .single()
    if (!existing) break
  }

  const expiresAt = planConfig.expiresInDays
    ? new Date(Date.now() + planConfig.expiresInDays * 86400000).toISOString()
    : null

  const { error } = await supabase.from('ace_enrollments').insert({
    access_code:       code,
    email:             email,
    plan:              planConfig.plan,
    expires_at:        expiresAt,
    stripe_session_id: session.id,
    is_active:         true,
  })

  if (error) {
    console.error('Failed to insert enrollment:', error)
    return new Response('DB error', { status: 500 })
  }

  console.log(`Enrollment created: ${code} (${planConfig.plan}) for ${email}`)

  // Send welcome email with access code
  if (email) {
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ACE Avionics Training <training@aceavionicstraining.com>',
          to: email,
          subject: 'Your CAET Training Access Code',
          html: `
            <div style="background:#0a0a0f;color:#e8e8e8;padding:40px;font-family:system-ui,sans-serif;">
              <h1 style="color:#00AAFF;margin-bottom:20px;">Welcome to ACE Avionics Training</h1>
              <p>Your access code is:</p>
              <div style="background:#12121a;border:2px solid #00AAFF;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
                <span style="font-family:monospace;font-size:28px;color:#00AAFF;letter-spacing:4px;">${code}</span>
              </div>
              <p>Go to <a href="https://learn.aceavionicstraining.com" style="color:#00AAFF;">learn.aceavionicstraining.com</a> and enter this code to start training.</p>
              <p style="margin-top:30px;color:#888;">Built by Nick Brown. Air Force veteran. 500+ technicians trained.</p>
            </div>
          `,
        }),
      })
    }
  }

  return new Response(JSON.stringify({ code }), { status: 200 })
})
