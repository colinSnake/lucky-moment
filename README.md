<p align="center">
  <img src="apps/web/public/favicon.svg" width="104" alt="Lucky Moment icon" align="middle" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/lucky-moment-wordmark.svg" width="420" alt="Lucky Moment" align="middle" />
</p>

<p align="center">
  An interactive wedding lottery app for memorable moments.
</p>

<p align="center">
  <a href="README.zh.md">简体中文</a>
</p>

<p align="center">
  <a href="https://colinsnake.github.io/lucky-moment/">Live Demo</a>
</p>

Lucky Moment is an interactive lottery application designed for wedding events. The frontend is built with React, Vite, TypeScript, and Three.js CSS3DRenderer to create rotating and flip-card lottery animations. Fastify provides production static-file serving and a health-check endpoint.

The project uses a pnpm monorepo with the frontend and backend in `apps/web` and `apps/backend`.

<br />

## Screenshots

| Sphere layout | Grid layout |
| --- | --- |
| ![Lucky Moment sphere lottery layout](docs/screenshots/01-sphere-lottery.jpg) | ![Lucky Moment grid lottery layout](docs/screenshots/02-grid-lottery.jpg) |

![Lucky Moment winner result page](docs/screenshots/03-winner-result.png)

<br />

## Features

- Switch between flat-card and spherical-card layouts
- Three.js CSS3D lottery animations and card-flip effects
- Start, pause, redraw, reset, and winner-result display workflows
- Local lottery progress persistence with IndexedDB
- Excel participant-list import and winner-result export
- Chinese voice announcements and background music controls
- Particle background, winner confetti, and an animated prize panel
- Limit the number of participants with `?participantsCount=N`
- Web Crypto-based random selection without biased simple modulo sampling

<br />

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript |
| 3D / Animation | Three.js CSS3DRenderer, Tween.js |
| Visual Effects | tsParticles, canvas-confetti |
| Local Data | IndexedDB |
| Excel | SheetJS (`xlsx`) |
| Backend | Fastify, TypeScript |
| Package Manager | pnpm 10.32.0 |

<br />

## Requirements

- Node.js 20 or later
- pnpm 10.32.0

Enable Corepack and activate the pnpm version declared by the project:

```bash
corepack enable
corepack prepare pnpm@10.32.0 --activate
```

<br />

## Getting Started

Run the following commands from the repository root:

```bash
pnpm install
pnpm dev
```

Open the following development endpoints:

- Frontend: `http://localhost:9087/lucky-moment`
- Frontend with trailing slash: `http://localhost:9087/lucky-moment/`
- Backend: `http://localhost:9090`
- Health check: `http://localhost:9090/api/health`

Both `/lucky-moment` and `/lucky-moment/` are supported. The Vite development server proxies `/api` requests to the backend on port `9090`.

<br />

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the frontend and backend development servers |
| `pnpm dev:web` | Start only the Vite frontend server |
| `pnpm dev:backend` | Start only the Fastify backend server |
| `pnpm build` | Build the frontend and backend production output |
| `pnpm start` | Start the production Fastify server |
| `pnpm typecheck` | Run TypeScript checks for the frontend and backend |
| `pnpm test` | Run the lottery-rule tests |

For production mode:

```bash
pnpm build
pnpm start
```

The production app is available at `http://localhost:9090/lucky-moment`.

<br />

## Project Structure

```text
.
├── apps/
│   ├── web/
│   │   ├── public/                 # Fonts, images, music, markdown, and favicon
│   │   ├── src/
│   │   │   ├── app/                # Global CSS and app-level resources
│   │   │   ├── assets/             # WebP background assets
│   │   │   ├── components/         # Page UI components
│   │   │   ├── module/
│   │   │   │   ├── effects/        # Confetti and other visual effects
│   │   │   │   ├── indexedDB/      # Local persistence
│   │   │   │   ├── lottery/        # Lottery rules, Excel, and random logic
│   │   │   │   ├── locale/         # English and Chinese copy
│   │   │   │   ├── mockData/       # Prize and visual configuration
│   │   │   │   └── util/           # Runtime, events, and audio utilities
│   │   │   ├── App.tsx             # Application composition entry
│   │   │   └── main.tsx            # React mount entry
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── backend/
│       └── src/server.ts           # Fastify static server and API
├── docs/
│   ├── lucky-moment-wordmark.svg   # README wordmark
│   └── screenshots/                # README project screenshots
├── package.json                    # Workspace scripts
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── tsconfig.json
```

`apps/web/dist` and `apps/backend/dist` are generated build directories and are not committed to Git.

<br />

## Configuration

The backend supports the following environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `9090` | Fastify listening port |
| `HOST` | `0.0.0.0` | Fastify listening host |
| `WEB_ORIGIN` | Allow all origins | CORS origins, separated by commas |

Frontend development settings are configured in `apps/web/vite.config.ts`:

- Development port: `9087`
- Application base path: `/lucky-moment`
- API proxy: `/api` → `http://localhost:9090`

<br />

## Performance Notes

- The particle layer is loaded lazily with `React.lazy`.
- tsParticles limits particle count and frame rate, and pauses when the page loses focus.
- Three.js requests animation frames only while active Tweens are running.
- Tween.js uses an independent `Group` to isolate animation state.
- `xlsx` is loaded dynamically only for Excel import or export.
- Three.js, React, and other large dependencies are split by Vite.
- The confetti effect is loaded dynamically when a winning animation completes.
- WebP backgrounds are used, and generated build/cache directories stay out of Git.

<br />

## CI/CD

`.github/workflows/ci.yml` runs on pushes and pull requests targeting the `master` branch. It:

1. Installs pnpm dependencies
2. Runs TypeScript checks
3. Runs lottery-rule tests
4. Builds the frontend and backend

The frontend deployment is handled by `.github/workflows/deploy-pages.yml` and the backend remains available as a separate Fastify service when a Node.js runtime is needed.

<br />

## GitHub Pages

The frontend can also be deployed to GitHub Pages through `.github/workflows/deploy-pages.yml`. The workflow builds `apps/web` and publishes `apps/web/dist` whenever changes are pushed to `master`.

To enable it:

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Set **Source** to **GitHub Actions**.
4. Push to `master` or run **Deploy frontend to GitHub Pages** manually from the Actions tab.

The deployed site is available at [https://colinsnake.github.io/lucky-moment/](https://colinsnake.github.io/lucky-moment/). The Vite base path is configured as `/lucky-moment/` to match the repository URL.

GitHub Pages only hosts static files. It does not run the Fastify service or provide `/api/health`; the browser-based lottery, IndexedDB persistence, Excel import/export, and visual effects remain available because they are implemented in the frontend. Deploy `apps/backend` separately only if a production Node.js service is needed.

<br />

## Verification

Before submitting changes, run:

```bash
pnpm typecheck
pnpm test
pnpm build
```

The lottery-rule tests cover winner-count calculation, available-participant filtering, unbiased random selection, winner application, and rollback behavior.
