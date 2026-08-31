# Wathiqa (وثيقة)

Wathiqa is a mobile-first digital document wallet prototype inspired by the simple stacked-card experience of modern wallet apps. It keeps the existing Welcome, Wallet/Home, Add Document, Document Details, QR Verification, and Profile/Settings flows as a deployable static web app.

## Framework / stack

- **Framework:** Vanilla JavaScript, HTML, and CSS.
- **Runtime for build scripts:** Node.js.
- **Dependencies:** None. All app assets and source files are included in this repository.
- **Production artifact:** Static files that can be hosted by any static web host.

## Prototype scope and safety

- Fake/demo document data only.
- No government database integrations.
- Demo QR verification is clearly labeled as non-official.
- The prototype does not claim documents are officially verified.
- Locally added demo documents and mock settings persist only for the current browser session.
- No authentication, backend, or sensitive-document storage is included.

## Project structure

```text
.
├── index.html          # App HTML entry point
├── package.json        # Local development, build, and preview scripts
├── scripts/build.mjs   # Production build script
└── src/
    ├── main.js         # Wathiqa screens, navigation, demo data, and interactions
    └── styles.css      # Mobile-first wallet UI styling
```

## Run locally for development

```bash
npm run dev
```

Then open <http://127.0.0.1:4173> in the same environment.

## Build for production

```bash
npm run build
```

The production build is written to:

```text
dist/
```

The build command performs a JavaScript syntax check and then copies the deployable static app files into `dist/`.

## Preview the production build

After building, run:

```bash
npm run preview
```

Then open <http://127.0.0.1:4173> in the same environment.

## Deploy publicly

Because Wathiqa builds to static files, deploy the contents of `dist/` to any static hosting provider.

Common options:

1. **Netlify**
   - Build command: `npm run build`
   - Publish directory: `dist`
2. **Vercel**
   - Framework preset: `Other`
   - Build command: `npm run build`
   - Output directory: `dist`
3. **GitHub Pages / static server**
   - Run `npm run build`.
   - Upload or publish the contents of `dist/`.

No environment variables or backend services are required for this prototype. GitHub Pages deployment is configured in `.github/workflows/pages.yml`; enable **Settings → Pages → Build and deployment → Source: GitHub Actions** after pushing to `main`.
