// Supabase Edge Function — notify-lead
// Fires on every new form submission
// Sends a text to Chris AND a confirmation text to the submitter

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH_TOKEN  = Deno.env.get("TWILIO_AUTH_TOKEN")  || "";
const TWILIO_PHONE       = Deno.env.get("TWILIO_PHONE")       || ""; // your Twilio number e.g. +12085550100
const CHRIS_PHONE        = "+12089469198"; // Chris's number

async function sendSMS(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const params = new URLSearchParams({ To: to, From: TWILIO_PHONE, Body: body });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Twilio error:", err);
  }
  return res.ok;
}

serve(async (req) => {
  try {
    const payload = await req.json();

    // Supabase sends the row as payload.record
    const lead = payload.record || payload;
    const { name, phone, email, service, details } = lead;

    // ── TEXT 1: Notify Chris ──────────────────────────────────
    const chrisMsg =
`🏗️ NEW LEAD — Homestead Website

Name: ${name}
Phone: ${phone}
Email: ${email || "not provided"}
Service: ${service || "not specified"}
Details: ${details || "none"}

Reply to this number to reach them.`;

    await sendSMS(CHRIS_PHONE, chrisMsg);

    // ── TEXT 2: Confirm to submitter (only if they gave a phone) ──
    if (phone && phone.replace(/\D/g, "").length >= 10) {
      // Normalize phone — strip non-digits and add +1 if needed
      const digits = phone.replace(/\D/g, "");
      const normalized = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;

      const confirmMsg =
`Hi ${name}! This is Homestead Concrete & Excavation confirming we received your request.

Chris will be in touch shortly. For urgent jobs you can call or text directly at (208) 946-9198.

— Homestead Concrete & Excavation`;

      await sendSMS(normalized, confirmMsg);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
