# Architecture Overview

Paid Internships Now is a static, multi-page site. Everything runs client-side with CDN-loaded dependencies; there is no build step or server logic.

## High-Level Design Goals
- Be shippable as a simple static bundle (works from `file://` or any static host).
- Keep content editable by non-developers (single JSON for charts, copy in HTML).
- Use lightweight, dependency-minimal JavaScript for interactions and data viz.

## Page Map
- `index.html` — Hero, animated wage-gap stat, CTA cards, and a small sparkline preview of the equity chart.
- `stories.html` — Filterable card grid (STEM, Govt/Policy, Non-profit) with modal details.
- `data.html` — Tabbed Chart.js dashboard (offer rate, salary, industries, access equity).
- `survey.html` — Client-side form with thank-you state (no submission backend).
- `legal.html` — Cards linking to key federal guidance/resources.
- `involved.html` — Action center with toggled sections (petition, email template, campaign, share links).
- `about.html` — Mission, attribution, and sources.

## Data & Flow
- Data source: `assets/data/chart_data.json`.
  - Structure keys: `offer_rate`, `salary_comparison`, `industry_distribution`, `access_equity`.
  - Home sparkline (`homeMiniChart.js`) and all Data page charts (`dataCharts.js`) read from the same JSON for consistency.
- Fetch logic: vanilla `fetch` + Chart.js instantiation; errors log to console without breaking the page.

## JavaScript Modules
- `js/nav.js` — Highlights the active nav link based on the current path.
- `js/counters.js` — Animated numeric counter for home-page salary differential.
- `js/homeMiniChart.js` — Lazy-loads the mini line chart on the homepage using JSON data.
- `js/stories.js` — Button-driven filtering of story cards via `data-category` attributes.
- `js/dataCharts.js` — Configures four Chart.js instances (doughnut, bar, stacked bar, line) using shared base options.

## Styling System
- Base styles via Bootstrap 5.3.3 + Bootstrap Icons (CDN).
- Overrides and tokens live in `assets/css/custom.css` (brand color, fonts, card hover, chart/hero tweaks, data-page dark theme).
- Images are hot-linked from CC0/stock sources; no asset pipeline required.

## Hosting & Deployment
- Entire repo is static; deploy by serving the root directory (GitHub Pages, Netlify, Vercel static, S3/CloudFront, etc.).
- Recommended to serve via HTTP locally (`python -m http.server`) to allow `fetch` of local JSON without CORS issues.

## Extending
- Content: edit HTML copy directly; add new stories/cards by duplicating existing blocks.
- Data: extend `chart_data.json` and corresponding chart configs in `dataCharts.js` for new datasets.
- Theming: adjust `:root` variables and component overrides in `custom.css`.
- Forms: `survey.html` is front-end only; hook to a backend or form service to persist responses.
