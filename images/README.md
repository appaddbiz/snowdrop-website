# Image Sourcing Notes

## /images/projects/ — REAL Snowdrop Interiors project photography
Downloaded directly from the live campaign site (snowdropinteriors.com/campaign). These are genuine
completed/in-progress Snowdrop projects and should stay as-is, or be replaced with higher-resolution
originals if the client can supply them.

- `project-living-tv-wall-grand.webp` — Double-height living room, laser-cut jaali partition, TV media wall
- `project-tv-media-wall-closeup.webp` — Close-up of the same TV media wall unit
- `project-bedroom-wardrobe-tv-niche.webp` — Fitted bedroom wardrobe with integrated TV niche
- `project-kitchen-installation-progress.webp` — Modular kitchen mid-installation (used as "before" in the transformation slider)
- `project-bedroom-wardrobe-mirror-unit.webp` — Finished glossy wardrobe with mirror dressing unit
- `project-kitchen-finished-grey-modular.webp` — Finished grey modular kitchen (used as "after" in the transformation slider)
- `logo.png` — Snowdrop Interiors logo (transparent), from the campaign site

## /images/stock/ — TEMPORARY placeholder photography
These are royalty-free Unsplash photographs used as realistic stand-ins so the site is not empty.
**Replace every file in this folder with real Snowdrop project photography as it becomes available.**
Every `<img>` using a stock file is easy to find in the HTML — the `src` path contains `/stock/`.
Filenames describe the room/category they were chosen for, so swapping is a 1:1 filename match.

None of these images should be presented as verified Snowdrop project work in any marketing claim.

## General
- All images are served as `.webp` for performance.
- Add `srcset`/multiple resolutions per image before final production launch for best Core Web Vitals
  (current build ships one appropriately-sized file per slot with `loading="lazy"` below the fold).
- Every `<img>` has a descriptive, SEO-meaningful `alt` attribute already in place.
