# Homestead Concrete & Excavation — Website

3-page React site deployed on Vercel with Supabase for lead capture.

---

## Stack
- **React** (Create React App)
- **Supabase** — database + lead notifications
- **Vercel** — hosting & deployment
- **Google Fonts** — Barlow Condensed + Inter

---

## Deploy Steps

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) → New project
2. Go to **SQL Editor** → paste contents of `SUPABASE_SETUP.sql` → Run
3. Go to **Settings → API** → copy your Project URL and anon key

### 2. GitHub
1. Create a new repo on github.com (e.g. `homestead-concrete`)
2. Upload all files from this folder into the repo

### 3. Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Add Environment Variables:
   - `REACT_APP_SUPABASE_URL` = your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Deploy**

### 4. Domain (when ready)
1. In Vercel → your project → Settings → Domains
2. Add your domain and follow the DNS instructions

---

## Notifications (Text + Email on Form Submit)

When a lead is submitted, Supabase triggers a webhook. To set up text + email:

1. In Supabase → **Edge Functions** → New Function → name it `notify-lead`
2. Use a service like [Resend](https://resend.com) for email and [Twilio](https://twilio.com) for SMS
3. The function receives the lead data and fires both notifications

A basic Edge Function template:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const lead = await req.json()

  // EMAIL via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'leads@homesteadconcrete.com',
      to: 'Homesteadexconcrete@gmail.com',
      subject: `New lead: ${lead.name}`,
      html: `<p><b>${lead.name}</b> — ${lead.phone}<br>${lead.service}<br>${lead.details}</p>`
    })
  })

  // SMS via Twilio
  const twilioBody = new URLSearchParams({
    To: '+12089469198',
    From: Deno.env.get('TWILIO_PHONE') || '',
    Body: `New lead: ${lead.name} | ${lead.phone} | ${lead.service}`
  })
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(Deno.env.get('TWILIO_ACCOUNT_SID') + ':' + Deno.env.get('TWILIO_AUTH_TOKEN'))}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: twilioBody
  })

  return new Response('ok')
})
```

---

## Trackd CRM Integration
When Trackd is ready, the `notify_new_lead` trigger in Supabase can also
POST to your Trackd webhook endpoint. Every form submission will automatically
create a new lead in Trackd — no extra work needed on the site.

---

## SEO Notes
- Meta tags, Open Graph, and Twitter Card in `public/index.html`
- LocalBusiness JSON-LD schema included
- Geo meta tags for Athol, ID
- Page titles update dynamically per route
- Update `canonical` URL and `og:image` once domain is live
