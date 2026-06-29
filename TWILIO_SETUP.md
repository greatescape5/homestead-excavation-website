# SMS Notification Setup — Twilio + Supabase Edge Function

When someone submits the contact form, two texts fire automatically:
1. Chris gets the full lead details
2. The submitter gets a confirmation text

---

## Step 1 — Get a free Twilio account

1. Go to twilio.com → sign up free
2. Verify your phone number
3. Twilio gives you a free phone number and $15 trial credit (enough for hundreds of texts)
4. From your Twilio dashboard, grab:
   - **Account SID** (starts with AC...)
   - **Auth Token**
   - **Your Twilio phone number** (e.g. +12085550100)

---

## Step 2 — Deploy the Edge Function in Supabase

1. Go to supabase.com → your project
2. Click **Edge Functions** in the left sidebar
3. Click **New Function** → name it exactly: `notify-lead`
4. Paste the contents of `supabase/functions/notify-lead/index.ts`
5. Click **Deploy**

---

## Step 3 — Add Twilio secrets to Supabase

1. In Supabase → **Edge Functions** → click `notify-lead`
2. Click **Secrets** tab
3. Add these three secrets:
   - `TWILIO_ACCOUNT_SID` = your Account SID from Twilio
   - `TWILIO_AUTH_TOKEN` = your Auth Token from Twilio
   - `TWILIO_PHONE` = your Twilio number (format: +12085550100)

---

## Step 4 — Update the SQL trigger

In SUPABASE_SETUP.sql, find this line:
```
url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-lead',
```
Replace YOUR_PROJECT_REF with your actual project ref.
(Find it in Supabase → Settings → General → Reference ID)

Then re-run the SQL in the SQL Editor.

---

## That's it!

Submit a test form on the website. Within a few seconds:
- Chris gets a text at (208) 946-9198
- The person who submitted gets a confirmation text

---

## Trial account note
Twilio free trial can only text verified numbers until you upgrade (~$20).
Upgrade when ready to go fully live — it's pay-as-you-go after that,
roughly $0.0079 per text (fractions of a cent).
