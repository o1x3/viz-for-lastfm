# viz

Privacy first Last.fm dashboard. Single Next.js 16 app (App Router, Turbopack, React 19, Tailwind v4), package manager **pnpm**. No database, no server side storage, no test suite.

## Cursor Cloud specific instructions

Standard commands live in `package.json` (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm start`) and `README.md`. Notes below cover only non-obvious things.

- **Single service.** `pnpm dev` runs the whole app (default `http://localhost:3000`; the `.claude/launch.json` config uses port 3210). There is nothing else to start.
- **No env vars needed for dev or testing.** `SESSION_SECRET` has a deterministic dev fallback (see `src/lib/session.ts`), and the `/u/demo` route serves baked in sample data with no Last.fm API calls. So you can run and demo the full dashboard end to end without any secrets.
- **Real Last.fm sign in / real profiles require secrets.** Only if you need to exercise actual sign in or view a real `/u/<username>`, put `SESSION_SECRET`, `LASTFM_API_KEY`, and `LASTFM_SHARED_SECRET` in `.env.local`. Without them, real profiles render a "no-credentials" state (the demo route still works).
- **Hello world / smoke check:** load `/u/demo` and click a period in the "Top" switcher (Week/Month/3 Months/6 Months/Year/All Time); the top artists/albums/tracks re-fetch via the `?period=` query param.
- **No automated tests exist.** "Testing" here means `pnpm lint`, `pnpm build` (runs TypeScript type checking), and manual verification of `/u/demo`.
