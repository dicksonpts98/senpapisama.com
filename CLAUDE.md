# SENPAPI-SAMA — Portfolio Site Notes

Static HTML/CSS/JS art portfolio. No build step. Deployed via GitHub → Vercel
(repo: https://github.com/dicksonpts98/senpapisama.com.git). Push to `main` and
Vercel auto-redeploys.

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
4. Commit + push to `main`.

## Local preview

`.claude/launch.json` runs a Python static server. `/tmp/wusensei-site` is the
serve dir and gets wiped on restart — recreate it by copying `site/` there and
writing `serve.py` before calling preview_start.
