# SND Brightlife CBO — Vercel + Supabase Production Migration

This package contains the complete migrated Brightlife frontend and Vercel backend generated from the supplied CODE.GS.

## Project structure

- index.html — Brightlife frontend already switched to `/api/server`
- api/server.js — migrated Brightlife backend
- api/cron/[job].js — Vercel scheduled notification runner
- supabase/production_auth.sql — persistent sessions + rate limiting
- vercel.json — API limits and scheduled jobs
- .env.example — required environment variables

## First setup

1. Run `supabase/production_auth.sql` in Supabase SQL Editor.
2. Upload this project to GitHub.
3. In Vercel, add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `CRON_SECRET`.
4. If password reset emails are required, add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
5. If WhatsApp alerts are required, add `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.
6. Deploy.

## Security

Never place `SUPABASE_SECRET_KEY` in index.html or any browser JavaScript.
Never commit `.env` files.

## Important

The supplied CODE.GS used Google Apps Script services. This migration replaces the database HTTP layer, CacheService sessions/rate limiting, email, WhatsApp notifications, and PDF report generation with Vercel/Node equivalents.

KCB M-Pesa functions remain the same safe placeholder behavior already present in the supplied CODE.GS because that source explicitly states the current database build does not contain the KCB provider tables/columns.

Keep the old Google Apps Script deployment active until the Vercel deployment has been tested against real member, savings, loan, admin, messaging, reporting and payment workflows.
