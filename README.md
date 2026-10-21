# Lucky Moment

Lucky Moment is a wedding lottery application organized as a small pnpm monorepo with a Vite React frontend and a Fastify backend.

## Structure

```text
apps/
  web/   Vite + React + Three.js lottery UI
  backend/ Fastify API and production static hosting
```

## Development

```bash
pnpm install
pnpm dev
```

- Frontend: `http://localhost:5173/lucky-moment/`
- Backend: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## Production

```bash
pnpm build
pnpm start
```

The Fastify process serves `apps/web/dist` and exposes the API on port `3001`. Set `PORT`, `HOST`, or `WEB_ORIGIN` to override the defaults. Production uses compiled backend JavaScript from `apps/backend/dist` rather than running TypeScript through `tsx`.

## Performance decisions

- The particle layer is loaded after the initial React shell through `React.lazy`.
- `xlsx` is loaded only when importing or exporting a spreadsheet.
- Three.js and React are split into separate Vite chunks.
- Tween animation frames are scheduled only while animations are active.
- Event subscriptions are registered once and cleaned up on unmount.
- Lottery selection rules are isolated in `apps/web/src/module/lottery/lotteryState.ts` for deterministic testing and single-pass updates.
- IndexedDB persistence updates the existing record with `put` instead of clearing the entire store.
- Winner selection uses Web Crypto (`crypto.getRandomValues`) with rejection sampling; `Math.random` remains only in non-winning animation placement/duration code.
- `?participantsCount=N` continues to restrict eligibility to IDs `1..N`, even when a saved imported participant list exists.
- Large backgrounds use WebP; the winner background is requested only when the winner panel is shown, and the particle layer waits for idle time.
- Fastify sends no-cache headers for the HTML entry, one-year immutable headers for fingerprinted build assets, and one-day headers for public files.
