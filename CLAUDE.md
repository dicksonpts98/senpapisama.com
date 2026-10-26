# SENPAPI-SAMA — Portfolio Site Notes

Static HTML/CSS/JS art portfolio. No build step. Deployed via GitHub → Vercel
(repo: https://github.com/dicksonpts98/senpapisama.com.git). Push to `main` and
Vercel auto-redeploys.

## Site structure (three designs, shared data)

- `/` (root) — **Gallery homepage (Oct 2026 redesign)**: `index.html`,
  `home.css`, `home.js`, plus `data/gallery-meta.js` (latest-collections
  slideshow, moods, glow colours, opening wall order, con dates).
  This is the MAIN/live site. Responsive: desktop layout above 760px,
  phone layout (art-first 3-column wall) below.
- `/previous` — the earlier **"Dark Museum"** homepage: `previous.html`.
  It still uses root `style.css` + `main.js` (absolute paths) — keep those.
- `/classic/` — original **game-UI** design: `classic/index.html`,
  `classic/css/style.css`, `classic/js/main.js`.
- Shared by both: `data/artworks.js`, `assets/`, `images/`.
- Old `/v2` URLs redirect to `/` (see `vercel.json`) — the Dark Museum used to
  live at `/v2` before it was promoted to root (it now lives at `/previous`).
- **Path rule:** any page NOT at root must reference shared resources
  (`/data/`, `/assets/`, `/images/`) with ABSOLUTE paths, or they 404. Its own
  co-located files (css/js inside the same folder) can stay relative.

## Rules

- **New art goes on TOP.** When adding new artwork, place its entry at the very
  top of the `ARTWORKS` array in `data/artworks.js`, under the
  `// ── NEW RELEASES` section — so it shows first in "ALL WORKS" for better
  visibility on release. The `series` field still controls which category filter
  it appears under, independent of array position.

## Adding artwork

1. Convert source image to optimised JPEG (keeps the site fast):
   `sips -s format jpeg -s formatOptions 85 -Z 1800 "SOURCE.png" --out "site/images/NN_Name.jpg"`
2. Add an entry at the TOP of `ARTWORKS` (NEW RELEASES section) in `data/artworks.js`.
3. If it's a brand-new category, also add the series name to `CATEGORY_ORDER`.
4. Optional (new homepage): add an entry for the file in `data/gallery-meta.js`
   → `pieces` to set its mood (`ink`/`neon`/`day`/`dusk`), glow `tint`, or
   `land: true` for a wide piece. Without one it still shows (mood "day").
   For a new collection, add it to the top of `newCollections` there.
5. Commit + push to `main`.

## Local preview

`.claude/launch.json` runs a Python static server. `/tmp/wusensei-site` is the
serve dir and gets wiped on restart — recreate it by copying `site/` there and
writing `serve.py` before calling preview_start.
