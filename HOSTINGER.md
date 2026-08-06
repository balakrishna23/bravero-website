# Hostinger Deployment Notes

This repository has two hosting paths:

- `Cloudflare`: existing `vinext` and Worker-based flow
- `Hostinger`: standard Node-hosted Next.js flow

## Recommended Hostinger plan

Use `Business Web Hosting` for a normal marketing or company website.
Upgrade to `Cloud Startup` if you want more headroom for traffic or server-side load.

## Build and run commands

Set the Node.js app commands to:

- Build command: `npm run build:hostinger`
- Start command: `npm run start:hostinger`

The standard Next.js build output remains under `.next/`.
`next.config.ts` enables `output: "standalone"` so the app is compatible with standard Node hosting workflows.

## Node version

This project requires Node.js `>=22.13.0`.
In Hostinger, choose a `22.x` runtime if that exact patch version is not selectable.

## Environment variables

Set these in Hostinger before using the contact form:

- `NEXT_PUBLIC_SITE_URL` recommended, for example `https://bravero.ai`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `BRAVERO_NOTIFICATION_EMAIL`
- `GOOGLE_CALENDAR_ID` optional, defaults to `primary`
- `GOOGLE_CALENDAR_TIMEZONE` optional, defaults to `Asia/Kolkata`
- `BRAVERO_FOLLOW_UP_MINUTES` optional, defaults to `30`

## Important note

The Cloudflare-specific files still exist for the original deployment target:

- `worker/index.ts`
- `wrangler.jsonc`
- `vite.config.ts`
- `db/index.ts`

They do not need to be used for the Hostinger deployment path.
