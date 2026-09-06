# kroking.dev

Personal site for **Mahmoud Galal** — Senior Backend / Platform Engineer.
Static [Astro](https://astro.build) build, React islands, Tailwind, deployed to
GitHub Pages from `main`.

## What's in here

| Piece | Where | What it does |
| --- | --- | --- |
| Career map | `src/components/CareerHeatmap.tsx` | GitHub-style heat grid, but six career tracks × every month since 2023. Hover a cell, click a month, filter by employer, or flip to a table. |
| Live GitHub pulse | `src/components/LivePulse.tsx` | Contribution calendar, repo/follower counts and a public-activity ticker, fetched in the visitor's browser. |
| Stack map | `src/components/StackMap.tsx` | Pick a domain to narrow the stack, or a technology to see every role and project that used it. |
| Command palette | `src/components/CommandPalette.tsx` | `⌘K` / `/` — jump to any page, section, role or project. |
| Timeline | `src/components/Timeline.tsx` | Role-by-role detail, deep-linkable at `/work#<role-id>`. |

### How the heat is computed

`src/lib/careerMap.ts` derives every cell rather than hand-authoring it: for each
`(month, track)` it sums the track weight of every role running that month and adds
a point for anything that shipped, then buckets the result into six levels. Overlapping
roles genuinely burn hotter. The amber ramp is a single-hue sequential scale, validated
for monotonic OKLCH lightness against the `#0c0a09` surface with every adjacent step
clearing ΔE 8.

### Live data

GitHub's contribution calendar is GraphQL-only and needs a token, which a static site
can't hold — so the calendar comes from a public mirror
(`github-contributions-api.jogruber.de`) while everything else uses the anonymous REST
API. Anonymous callers get 60 requests an hour per IP, so responses are cached in
`sessionStorage` for 10 minutes and every panel degrades to a quiet fallback rather
than an error state.

## Editing content

All copy lives in `src/data/`, not in components:

- `profile.ts` — name, links, summary, tracks, domains
- `career.ts` — roles, per-track weights, dated milestones, education
- `projects.ts` — featured projects and open-source tools

Adding a role to `career.ts` re-renders the heatmap, the timeline, the stack map and
the command palette automatically.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run build` | Typecheck, then build to `./dist/` |
| `npm run preview` | Serve the production build locally |
