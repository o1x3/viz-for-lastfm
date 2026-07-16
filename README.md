# viz

**Your Last.fm, visualized.** A privacy-first dashboard for your [Last.fm](https://www.last.fm) scrobbles.

Sign in with your Last.fm account and see your listening properly: top artists, albums and tracks, a radial listening clock, streaks, and a live now-playing bar. Any profile is viewable at `/u/<username>`.

## Privacy model

- **Nothing is stored server-side.** No database.
- Signing in keeps only your username and Last.fm session key, sealed into an **encrypted, httpOnly cookie in your own browser** (AES-256-GCM).
- Last.fm API responses are cached briefly in-memory to be polite to their API, then evicted.
- Sign out at any time to destroy the cookie; revoke the app at [last.fm/settings/applications](https://www.last.fm/settings/applications).

## Running it

```bash
pnpm install
cp .env.example .env.local   # fill in all three values
pnpm dev
```

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | yes (prod) | Key for sealing the session cookie. Any long random string. |
| `LASTFM_API_KEY` | yes | Your Last.fm API key. |
| `LASTFM_SHARED_SECRET` | yes | The shared secret shown next to your key. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for OG/social cards. On Vercel, auto-detected from `VERCEL_*` if unset. Set when using a custom domain. |

Get an API key in ~30 seconds at [last.fm/api/account/create](https://www.last.fm/api/account/create). Any name works; leave the callback URL blank (the app passes the callback dynamically at sign-in).

Try it without keys at `/u/demo` (sample data).

## Deploying to Vercel

1. Push this repo to GitHub and [import it in Vercel](https://vercel.com/new). Vercel auto-detects Next.js and `pnpm` from `pnpm-lock.yaml`; no extra config needed.
2. In **Project → Settings → Environment Variables**, add:
   - `SESSION_SECRET`: any long random string (e.g. `openssl rand -base64 32`)
   - `LASTFM_API_KEY` and `LASTFM_SHARED_SECRET`: from your Last.fm API account
   - `NEXT_PUBLIC_SITE_URL`: only if you use a custom domain (e.g. `https://viz.example.com`); preview/production `*.vercel.app` URLs work without it
3. Deploy. Sign-in uses your deployment origin as the Last.fm callback (`/api/auth/callback`), so auth works on preview and production URLs with no Last.fm dashboard changes.
4. Smoke-check `/u/demo` after deploy; sign in on `/` once keys are set.

`pnpm build` is the production build command (Vercel runs this automatically).

## Non-commercial

This is a nonprofit hobby project under Last.fm's standard (non-commercial) API terms. Not affiliated with Last.fm Ltd.
