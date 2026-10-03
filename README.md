# SND Brightlife CBO

Production Node.js web application for SND Brightlife CBO covering member services, savings, table banking, lending, repayments, guarantor approvals, administration, reporting and community programmes.

## Stack

- Node.js 20+
- Vercel serverless runtime
- Supabase / PostgreSQL
- HTML, CSS and browser JavaScript
- Resend and WhatsApp Cloud API integrations
- Vercel Cron for scheduled operations

## Run locally

```bash
npm install
node --env-file=.env server.mjs
```

The application is available at `http://localhost:3000`.

For Vercel development, `npm run dev` starts the Node.js application directly. Production deployments continue to use the existing Vercel serverless API and cron configuration.

## Environment

Copy `.env.example` to `.env` and provide the production values for Supabase, cron authentication and any enabled messaging/payment integrations.

Never expose server secrets in browser code.

## Project structure

```text
/
├── index.html
├── assets/
│   ├── app.css
│   └── app.js
├── api/
│   ├── server.js
│   └── cron/[job].js
├── project-images/
├── server.mjs
├── package.json
└── vercel.json
```

The browser application keeps the established Brightlife workflows and calls the Node.js API at `/api/server`. The standalone Node server provides the same API locally while Vercel continues to run the production serverless functions.

## Current production UI

The workspace uses a persistent member navigation shell, responsive navigation, route-aware browser history, a direct member-login logout flow, and a responsive statement/reporting centre. Public navigation uses the same responsive layout rules across desktop and mobile.

## Production deployment

Deploy the repository to the existing Vercel project with the required environment variables. No database migration is required for this frontend/Node runtime modernization.
