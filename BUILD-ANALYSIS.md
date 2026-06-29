# SVX Build Analysis (Phase 0)

This document inventories the approved static mockup and maps every mockup section to a WordPress template part and a plugin field. It is the fidelity and field model contract for the theme (`papingu-svx-theme`) and plugin (`papingu-svx-plugin`).

Detected GitHub owner: `granittemaj` (via `gh api user -q .login`). Git Updater headers will use `granittemaj/papingu-svx-theme` and `granittemaj/papingu-svx-plugin`.

---

## 1. Repository inventory

### 1.1 HTML pages (8 files)

| File | Becomes | Template |
|------|---------|----------|
| `index.html` | Home (front page) | `front-page.php` |
| `technology.html` | Technology | `page-technology.php` |
| `markets.html` | Markets | `page-markets.php` |
| `company.html` | Company | `page-company.php` (see note A) |
| `newsroom.html` | Newsroom (list) | `page-newsroom.php` |
| `article.html` | Single news article | `single-psvx_news.php` |
| `careers.html` | Careers | `page-careers.php` |
| `contact.html` | Contact | `page-contact.php` |

> **Note A, RESOLVED:** the brief lists six pages (Home, Technology, Markets, Newsroom, Careers, Contact). The mockup ships a seventh page, **Company**, linked in the primary nav and footer on every page, and the target of every "Investor relations" button via `company.html#invest`. Decision: **build Company as a seventh page** to preserve full fidelity and keep all links working.

### 1.2 CSS

- `assets/css/style.css` (396 lines). Single stylesheet, light and dark themed via `[data-theme]`, shared across all pages. Two logical layers: base/layout, then a "creative layer" (atmosphere, motion, real logo, marquee, interlude). Ported into the theme unchanged except for the font `@import`/path and asset URLs.

### 1.3 JavaScript

- `assets/js/main.js` (159 lines). Two IIFEs:
  1. Shared behavior: theme toggle (persisted), nav scroll state, mobile menu, reveal-on-scroll, animated counters, animated bars, generative SVG lattice for `[data-lattice]` blocks, footer year.
  2. Hero canvas "living cathode lattice" (`#field`): node grid, edges, traveling pulses, mouse parallax, reduced-motion static draw.

### 1.4 Fonts (Google Fonts, must be self hosted)

Loaded from `fonts.googleapis.com` on every page:
- **Bricolage Grotesque** opsz 12..96, weights 500, 600, 700, 800 (display, headings, wordmark)
- **Hanken Grotesk** weights 400, 500, 600, 700 (body)
- **JetBrains Mono** weights 400, 500, 600 (eyebrows, mono labels, meta)

Plan: download these exact families, bundle WOFF2 under `theme/assets/fonts/`, ship a local `fonts.css` with `font-display:swap`, preload the two most used weights, remove all `fonts.googleapis.com` / `fonts.gstatic.com` requests.

### 1.5 Images and SVG assets

| File | Content | Usage |
|------|---------|-------|
| `assets/img/svx-logo-color.svg` | Color "X" mark, 200x200 viewBox | Nav + footer brand (light), interlude large feature image |
| `assets/img/svx-x.svg` | White "X" mark, 200x200 viewBox | Nav brand (dark), footer brand (always white) |

Notes:
- There is **no separate wordmark image**. The wordmark "SVX" is rendered as Bricolage Grotesque text next to the X mark.
- The logo swap is pure CSS: `.logo-x .x-color` shows in light, `.x-white` shows in dark and always in the footer (`.footer .logo-x`).
- All other "visuals" (hero field, market feature blocks, team avatars, market icons) are inline SVG or canvas generated in code, no raster images anywhere.

---

## 2. Design tokens (from `:root` and `[data-theme="dark"]`)

### 2.1 Brand palette (theme independent)
```
--amber:#E8743B   --amber-2:#F2A35E   --amber-deep:#C85A28
--teal:#2A5E5F    --sage:#4E5A40      --indigo:#26295D
--ink:#0E1124     --ink-2:#171A30     --teal-900:#0F3032
--on-ink:rgba(246,242,233,.74)  --on-ink-strong:#F6F2E9  --on-ink-line:rgba(246,242,233,.14)
```

### 2.2 Semantic, LIGHT
```
--bg:#F6F2E9  --bg-alt:#EFE9DB  --surface:#ffffff
--text:#0E1124  --text-dim:rgba(14,17,36,.62)  --text-mute:rgba(14,17,36,.45)
--border:rgba(14,17,36,.12)  --border-soft:rgba(14,17,36,.07)
--logo:rgba(14,17,36,.42)  --nav-bg:rgba(246,242,233,.82)
--feat-1:var(--ink)  --feat-2:var(--teal-900)  --feat-3:var(--ink-2)  --feat-cta:var(--ink)  --feat-foot:var(--ink-2)
```
Theme color meta (light): `#F6F2E9` (the `--bg`).

### 2.3 Semantic, DARK
```
--bg:#070912  --bg-alt:#0C0F1C  --surface:#151A2C
--text:#F3F0E7  --text-dim:rgba(243,240,231,.68)  --text-mute:rgba(243,240,231,.42)
--border:rgba(243,240,231,.13)  --border-soft:rgba(243,240,231,.07)
--logo:rgba(243,240,231,.4)  --nav-bg:rgba(7,9,18,.85)
--feat-1:#0E1124  --feat-2:#0E2E30  --feat-3:#12162A  --feat-cta:#0C1022  --feat-foot:#0A0D1A
```
Theme color meta (dark): `#070912`.

### 2.4 Layout, easing, gradients
- `--ease:cubic-bezier(.16,1,.3,1)`, `--maxw:1280px`, content padding 32px (22px under 680px).
- Section rhythm: `.sec{padding:110px 0}`, dark CTA `130px`, stakes `120px`.
- Accent text gradient (light): `linear-gradient(105deg,var(--indigo),var(--teal) 48%,var(--sage))`; (dark): `linear-gradient(105deg,#6b6fc0,#46c7b8 48%,#aab06a)`.
- Interlude band (always warm): `linear-gradient(135deg,#F8ECDB 0%,#F4DDC4 42%,#EFE7D4 100%)`, text `#1b1430`, eyebrow `#b5531f`.
- Grain overlay: inline SVG fractal noise data URI, `opacity:.045`, `mix-blend-mode:soft-light`, `z-index:9998`.
- Reveal: `translateY(26px)` to none, `.8s var(--ease)`, stagger classes `.d1`..`.d4` at 80ms steps.

### 2.5 Breakpoints
- `980px`: hero stacks, two-up grids collapse, attrs/process go 2 col, footer 2 col.
- `680px`: nav links hidden + burger shown, most grids go 1 col, news rows stack.

---

## 3. Interactive behaviors (port as is)

| Behavior | Source | Notes for theme |
|----------|--------|-----------------|
| No-flash theme script | inline `<head>` script, every page | Move verbatim into `header.php`, reads `localStorage('svx-theme')`, falls back to `prefers-color-scheme`, sets `data-theme` before paint |
| Theme toggle, persisted | `main.js` IIFE 1, `#themeTg` | Sun/moon inline SVG icons, writes `localStorage`. Add `theme-color` meta update (edge case requirement, not in mockup yet) |
| Nav scrolled state | `main.js` | toggles `.scrolled` past `scrollY>40` |
| Mobile menu | `main.js` `.burger` | Current mockup uses inline style toggle. Theme will keep markup identical but harden with focus trap, Escape, link-close, scroll lock, focus return (edge-case + a11y requirements) |
| Reveal on scroll | `.reveal` + IntersectionObserver | threshold .14, unobserve after |
| Animated counters | `[data-count][data-suffix]` | cubic ease-out, 1400ms, 1 decimal when fractional |
| Animated bars | `.viz-card .bar-fill[data-w]` | width transition, staggered 120ms |
| Generative lattice SVG | `[data-lattice]` (market feature blocks) | 7x7 jittered grid, distance-linked lines, random hot amber dots with opacity animation |
| Hero canvas field | `#field` | DPR capped at 2, rebuild on resize, mouse parallax, pulses every 900ms, reduced-motion static draw. Add: pause when tab hidden / offscreen, no parallax on touch, graceful degrade if no 2d ctx (edge-case requirements) |
| Rotating badge | `.hero-badge .spin` textPath | 26s linear spin, "POWERED BY NATURE" |
| Marquee | `.marquee-track` | 34s linear, duplicated track for seamless loop, stroke text + amber fill words + teal dots |
| Footer year | `#year` | JS sets current year; theme can render server-side instead |
| Reduced motion | CSS `@media(prefers-reduced-motion)` + JS guards | blobs/badge/marquee/scrollcue/hero lines animation off, canvas static |

---

## 4. Section to template-part to field map

Template parts (theme `template-parts/`): `nav`, `footer`, `hero-cine`, `page-hero`, `mesh`, `grain` (in footer/body), `badge`, `marquee`, `interlude`, `stat-strip`, `logorow`, `viz-bars`, `pillars`, `markets-teaser`, `market-block`, `process`, `attrs`, `traction`, `news-card`, `news-row`, `values`, `team`, `role`, `cta`, `contact-form`.

Field helper API: `psvx_field($name,$default,$post_id)` for per-page fields, `psvx_option($name,$default)` for SVX Settings. Every default equals the mockup copy so an empty install renders identically.

### 4.1 Global (SVX Settings options page)

| Setting | Field type | Default (from mockup) |
|---------|-----------|-----------------------|
| Logo, color X + wordmark | image | bundled `svx-logo-color.svg` |
| Logo, white X | image | bundled `svx-x.svg` |
| Wordmark text | text | `SVX` |
| Primary nav items | repeater (label, url, ext) | Technology, Markets, Company, Newsroom, Careers |
| Nav CTA label / link | text / link | `Partner with us` / Contact page |
| Marquee items | repeater (text, emphasis bool) | Powered by nature; Future-proof by design (fill); Lower cost; Lower capital; Lower carbon; Precursor-free (fill); Waterless |
| Footer description | textarea | `Sylvatex is an advanced materials technology company future-proofing the manufacturing of the lithium-ion battery cathode.` |
| Footer columns | repeater (heading, links repeater) | Company [Technology, Markets, About, Newsroom, Careers]; Connect [Partner with us, Investors, Media inquiries] |
| Social links | repeater (label, url) | LINKEDIN, TWITTER |
| Contact block | group | address `San Francisco Bay Area / California, USA`; general `hello@sylvatex.com`; media `media@sylvatex.com`; phone `+1 415-662-3835` |
| Copyright line | text | `(c) {year} Sylvatex Inc. All rights reserved.` |
| Investors list | repeater (name) | Motus Ventures, Zygote Ventures, Golden Seeds, Ultratech, Catalus, Amplify Capital, Incite, Unreasonable |
| Labs / affiliates list | repeater (name) | NSF, New Energy Nexus, CalTestBed, ARPA-E, Argonne National Laboratory, Berkeley Lab, USDA |
| Home validation logos | repeater (name) | Berkeley Lab, Argonne, ARPA-E, NSF, USDA, New Energy Nexus, CalTestBed |
| Default meta description | textarea | per-page defaults below |
| Default OG image | image | placeholder, flagged |
| Contact form recipient | email | placeholder, flagged (mockup has no recipient) |

### 4.2 Home (`front-page.php`) sections, in order

| # | Section | Template part | Fields |
|---|---------|---------------|--------|
| 1 | Cinematic hero (mesh, field canvas, badge, scrollcue) | `hero-cine` | eyebrow `Advanced Cathode Active Materials`; headline two lines with accent words `Powered by nature. / Engineered for the cathode.`; lede (long); primary CTA `Explore the technology`/Technology; secondary CTA `Partner with us`/Contact; badge text `POWERED BY NATURE` |
| 2 | Marquee | `marquee` | global marquee items |
| 3 | Stat strip (4 counters) | `stat-strip` | repeater: value, suffix, label. Defaults 60.1%, 47.6%, 10x, 0 gal with the four labels |
| 4 | Logo row (validation) | `logorow` | kicker `Validated with national laboratories...`; global validation logos |
| 5 | Brand interlude | `interlude` | eyebrow `Our belief`; statement (with `<em>` accent); body; feature image (global color logo) |
| 6 | Stakes (dark, 2 viz cards + note) | `viz-bars` | eyebrow `The stakes`; heading; intro; cost bars repeater (label, pct); carbon bars repeater; note paragraph |
| 7 | Technology teaser (3 pillars) | `pillars` | eyebrow `The technology`; heading; intro; pillars repeater (num, label, title, body); link `See the full technology` |
| 8 | Markets teaser (dark, 3 cards) | `markets-teaser` | eyebrow; heading; intro; markets repeater (icon key, num, title, body); link |
| 9 | Traction (dark, 4 items) | `traction` | repeater (value, label): Pilot, Top-tier, National, Non-dilutive |
| 10 | Newsroom teaser (3 cards) | `news-card` x3 | heading `Momentum, on the record.`; pulls latest 3 `psvx_news` |
| 11 | Investors logo row | `logorow` | global investors list |
| 12 | Closing CTA (dark) | `cta` | eyebrow `Get in touch`; heading; body; primary + investor-relations buttons |

### 4.3 Technology (`page-technology.php`)

| Section | Part | Fields |
|---------|------|--------|
| Page hero | `page-hero` | eyebrow `The technology`; h1; lede |
| Why the cathode (dark, 2 viz cards) | `viz-bars` | eyebrow; heading; intro; cost bars; carbon bars (same data as home, separate fields) |
| The process (4 steps) | `process` | eyebrow; heading; steps repeater (step num, title, body) x4 |
| Three outcomes (3 pillars, bg-alt) | `pillars` | eyebrow; heading; pillars repeater x3 |
| Capabilities (8 attrs) | `attrs` | eyebrow; heading; attrs repeater (index, title, body) x8 |
| CTA | `cta` | eyebrow; heading; body; buttons |

### 4.4 Markets (`page-markets.php`)

| Section | Part | Fields |
|---------|------|--------|
| Page hero | `page-hero` | eyebrow; h1; lede |
| Feature blocks (3, alternating flip) | `market-block` | repeater: tag (`01 / Mobility`), title, body, list items repeater, visual label (`EV · MOBILITY`), flip bool |
| CTA | `cta` | eyebrow; heading; body; buttons |

### 4.5 Company (`page-company.php`) — see Note A

| Section | Part | Fields |
|---------|------|--------|
| Page hero | `page-hero` | eyebrow `Company`; h1 `Future-proof by design.`; lede |
| Mission + 4 values | `values` | eyebrow; heading; intro; values repeater (label, title, body) x4 |
| Leadership (4 cards) | `team` | eyebrow; heading; intro; leaders repeater (initials, name, role). Only Virginia Klausmeier is real; other 3 are placeholders |
| Collaborators logo row | `logorow` | global labs/affiliates list |
| Investors logo row (bg-alt, #invest anchor) | `logorow` | global investors list |
| CTA | `cta` | eyebrow; heading; body; buttons |

### 4.6 Newsroom (`page-newsroom.php`)

| Section | Part | Fields / source |
|---------|------|-----------------|
| Page hero | `page-hero` | eyebrow; h1 `Momentum, on the record.`; lede |
| News list | `news-row` loop | `psvx_news` CPT, newest first, paged. 12 seed items captured from mockup |
| Pager | built-in WP pagination | |
| CTA (Media inquiries) | `cta` | eyebrow; heading; body; buttons |
| Empty state | calm "More soon" | edge-case requirement |

### 4.7 Single article (`single-psvx_news.php`) from `article.html`

| Section | Part | Fields |
|---------|------|--------|
| Breadcrumb | `page-hero` (slim) | Home / Newsroom / Article |
| Prose | post content | meta line (date + category), h1 title, body (WYSIWYG), blockquote, lists |
| CTA | `cta` | eyebrow; heading; body; buttons |

`psvx_news` fields: title, date, category (Milestone, Media, Leadership, Recognition, Perspective), external source URL (when the row links out instead of to a full article), optional body. Admin columns: date, category.

### 4.8 Careers (`page-careers.php`)

| Section | Part | Fields |
|---------|------|--------|
| Page hero | `page-hero` | eyebrow; h1; lede |
| Open roles | `role` loop | roles: `psvx_role` CPT **or** repeater (decision B). Each: title, meta line (team, type, location), description, apply link |
| Life at SVX (2 values, bg-alt) | `values` | eyebrow `Life at SVX`; heading; intro; values repeater x2 |
| CTA (Don't see your role?) | `cta` | eyebrow; heading; body; buttons |

> **Decision B, RESOLVED:** roles use a **`psvx_role` CPT** (scales, editable individually, REST-exposed), for parity with news and future growth. Fields: title, meta line (team, type, location), description, apply link. Newest or menu-ordered.

### 4.9 Contact (`page-contact.php`)

| Section | Part | Fields |
|---------|------|--------|
| Page hero | `page-hero` | eyebrow `Contact`; h1 `Let's get in touch.`; lede |
| Form + info | `contact-form` | form intro (optional); fields Name, Email, Company, "How can we help?" select (Partnership / material qualification, Investor relations, Media inquiry, Careers, Other), Message; contact info pulls from SVX Settings |

Form handler: plugin-side, nonce + honeypot + server validation + `wp_mail` to SVX Settings recipient, success/error states, no-JS fallback, escapes all output.

---

## 5. SEO model

- Per-page title using the pipe pattern, e.g. `Technology | Sylvatex (SVX)`. Mockup currently uses an em dash in `<title>`; this will become a pipe (hard rule). Editable per page, sensible defaults captured from each page.
- Meta description per page (captured defaults below), canonical, Open Graph, Twitter card, JSON-LD Organization on the front page.
- Defer to a known SEO plugin if active (Yoast, Rank Math, SEOPress, AIOSEO), do not duplicate tags.

Captured default meta descriptions:
- Home: `SVX produces drop-in cathode active material through a precursor-free, waterless process. Lower cost, lower capital, lower carbon.`
- Technology: `A precursor-free, waterless route to cathode active material built on off-the-shelf equipment.`
- Markets: `One chemistry-agnostic platform serving electric mobility, grid energy storage, and defense.`
- Company: `SVX is an advanced materials technology company future-proofing the battery cathode.`
- Newsroom: `Milestones, recognition, and perspectives from the SVX team.`
- Careers: `Join SVX and help future-proof battery manufacturing.`
- Contact: `Get in touch with the SVX team about partnership, investment, media, or careers.`

---

## 6. Fidelity and content notes

- **Em dash policy, RESOLVED:** mockup copy contains em dashes (titles, `San Francisco Bay Area —` in the article, badge separators use `·`). Decision: **normalize everywhere**. Titles use the pipe separator (`Technology | Sylvatex (SVX)`), the article intro becomes `San Francisco Bay Area,`, and no em dash appears in any default, markup, or comment. Meaning preserved.
- **Placeholders to flag for real content:** OG image, contact form recipient email, leadership beyond Virginia Klausmeier (3 placeholder cards), real newsroom article bodies/URLs (only one full article exists, the rest link to `#`), real social URLs (currently `#`), partner/investor logos are text-only in the mockup (no image files).
- **Logo files** are X marks only; the wordmark is text. If the client later supplies a combined lockup SVG, it drops into the SVX Settings logo field with no template change.
- **Theme-color meta** and **focus-trap mobile menu** and **canvas visibility pausing** are required by the brief but not present in the mockup JS; they will be added without altering the visual result.

---

## 7. Section to plugin-field summary (one line each)

- Global brand, nav, marquee, footer, social, contact, investors, labs, validation logos, SEO defaults, form recipient: SVX Settings options page.
- Home: hero, stat strip, interlude, stakes bars, pillars, markets teaser, traction, closing CTA: per-page field group on `front-page.php`.
- Technology: hero, why-cathode bars, process steps, pillars, capabilities, CTA.
- Markets: hero, market blocks repeater, CTA.
- Company: hero, mission values, leadership, CTA (logo rows from globals).
- Newsroom: hero, intro, CTA; items from `psvx_news`.
- Careers: hero, roles (`psvx_role` or repeater), culture values, CTA.
- Contact: hero, form intro, select options; info from globals; handler in plugin.
- Article: from `psvx_news` single.

Every visible string, number, repeated block, image, and link in the mockup is represented above and will be editable.
