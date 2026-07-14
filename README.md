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
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for OG/social cards. |

Get an API key in ~30 seconds at [last.fm/api/account/create](https://www.last.fm/api/account/create) — any name works, leave the callback URL blank.

Try it without keys at `/u/demo` (sample data).

## Deploying to Vercel

Push to GitHub, import into Vercel, set the env vars above. Done.

## Non-commercial

This is a nonprofit hobby project under Last.fm's standard (non-commercial) API terms. Not affiliated with Last.fm Ltd.
