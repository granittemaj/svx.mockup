# Sylvatex (SVX) — Corporate Website Concept

A multi-page static site mockup proposing a more corporate / business-grade direction for the SVX site. Built to be shared and reviewed, then handed to a production (WordPress) build.

**Live preview:** enable GitHub Pages (see below) and open the published URL.

---

## What's inside

```
svx-site/
├── index.html        # Home
├── technology.html   # The process, pillars, capabilities, data
├── markets.html      # Mobility · Energy · Defense
├── company.html      # Mission, values, leadership, investors
├── newsroom.html     # Full news list + pagination
├── article.html      # Single news-post template
├── careers.html      # Open roles + culture
├── contact.html      # Contact form + info
├── .nojekyll         # Tells GitHub Pages to serve /assets as-is
└── assets/
    ├── css/style.css  # All styling (semantic design tokens)
    └── js/main.js     # Theme toggle, reveals, counters, generative visuals
```

## Design notes

- **Palette is derived from the existing SVX logo** (indigo &rarr; teal &rarr; sage gradient) plus the brand amber, so this reads as a refined evolution, not a rebrand.
- **Light / dark theme** with a toggle in the nav. Preference is saved (`localStorage`) and persists across pages; first visit respects the OS setting. Theme is set before first paint to avoid a flash.
- **Type:** Bricolage Grotesque (display), Hanken Grotesk (body), JetBrains Mono (technical labels), loaded from Google Fonts.
- **No build step, no framework, no dependencies.** Pure HTML/CSS/JS so it deploys anywhere.
- Partner / investor / lab names are styled **text placeholders** — drop in real SVG logos for production.
- Copy and figures are placeholders for review (cost/carbon shares, 10x growth, etc. reflect SVX's existing materials).

## Run locally

Just open `index.html` in a browser. Or serve it:

```bash
cd svx-site
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a repo and push these files (the contents of `svx-site/` at the repo root).
2. Repo &rarr; **Settings &rarr; Pages**.
3. **Source:** Deploy from a branch &rarr; **Branch:** `main` &rarr; **Folder:** `/ (root)` &rarr; Save.
4. Wait ~1 min; your URL appears at the top of the Pages settings (e.g. `https://<user>.github.io/<repo>/`).

> If you put the files in a `/docs` folder instead, pick `/docs` as the folder in step 3.

## Status

Concept mockup for internal review. Not production code — intended to align on direction before a WordPress build using the same design tokens and component structure.

---

## v2 — Creative pass

This version moves from "clean corporate" to something that represents what SVX *is*: nature reengineered into the heart of the battery.

- **Living cathode lattice** (`index.html` hero): an animated `<canvas>` node-and-bond field with warm charge pulses traveling through it, gently cursor-reactive. Falls back to a static lattice when `prefers-reduced-motion` is set.
- **Dawn-to-forest atmosphere:** layered, slow-drifting gradient mesh (amber / peach / teal / sage) plus a subtle film-grain overlay for depth. Themed for light and dark.
- **"Powered by nature" rotating badge** — an homage to the existing brand element.
- **Marquee** and a **brand interlude** ("Our belief") that features the real full-color SVX logo as a warm, always-on brand moment.
- **Real logo throughout:** the color X mark in light mode, the white X on dark surfaces, paired with the SVX wordmark. Assets live in `assets/img/`.

> **Fonts:** display/body fonts (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) load from Google Fonts, so the true typography appears once the page has internet access (locally or on GitHub Pages). Offline, the browser falls back to system fonts.
