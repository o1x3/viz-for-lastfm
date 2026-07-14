# viz

**Your Last.fm, visualized.** A privacy-first dashboard for your [Last.fm](https://www.last.fm) scrobbles.

Sign in with your Last.fm account and see your listening properly: top artists, albums and tracks, a radial listening clock, streaks, and a live now-playing bar. Any profile is viewable at `/u/<username>` once the server has an API key.

## Privacy model

- **Nothing is stored server-side.** No database.
- Your API key (and Last.fm session key, if you log in) are sealed into an **encrypted, httpOnly cookie in your own browser** (AES-256-GCM).
- Last.fm API responses are cached briefly in-memory to be polite to their API, then evicted.
- Log out at any time to destroy the cookie; revoke the app at [last.fm/settings/applications](https://www.last.fm/settings/applications).

## Running it

```bash
pnpm install
cp .env.example .env.local   # set SESSION_SECRET to a long random string
pnpm dev
```

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | prod | Key for sealing the session cookie. Any long random string. |
| `LASTFM_API_KEY` | no | Optional deployer-provided key so visitors don't need their own. |
| `LASTFM_SHARED_SECRET` | no | Optional deployer-provided secret enabling login without BYO keys. |

Without env keys, users paste their own — get one in ~30 seconds at [last.fm/api/account/create](https://www.last.fm/api/account/create).

Try it with zero setup at `/u/demo` (sample data).

## Deploying to Vercel

Push to GitHub, import into Vercel, set `SESSION_SECRET`. Done.

## Non-commercial

This is a nonprofit hobby project under Last.fm's standard (non-commercial) API terms. Not affiliated with Last.fm Ltd. or CBS Interactive.
