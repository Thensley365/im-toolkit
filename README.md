# IM Toolkit — how to update your site from now on

## Upload these 6 files to GitHub now (one time)

Go to your repo → "Add file" → "Upload files", drag these in, commit:

1. index.html   (the fixed site — replaces your current one)
2. sw.js
3. manifest.json
4. icon-180.png
5. icon-192.png
6. icon-512.png

Done. The site is fixed. Everything below is about *future* updates.

## The new update workflow

Your site is now split into two parts:

- **template.html** — the app itself (search, tabs, styling, all of today's
  bug fixes). This never changes. Never regenerate it.
- **bundle.json** — your 249 notes as data. This is the ONLY thing that
  changes when your Obsidian notes change.

When you want to update the site with new/edited notes:

1. Ask Claude (Code/Claudian) to regenerate **only bundle.json** from your
   vault. Tell it: "Update bundle.json for my IM Toolkit. Keep the exact same
   JSON structure: {generated, count, notes: [{i, title, path, cat, type,
   aliases, feature, ref, body}], res, catOrder}. Do NOT generate any HTML."
2. Run:  python3 build.py
   (needs template.html and bundle.json in the same folder; outputs index.html)
3. Upload the new index.html to GitHub. That's it.

Keep template.html, bundle.json, and build.py somewhere safe (your vault
folder is fine — or commit them to the repo too, which is the safest option).

## Why this matters

If you instead ask Claude to "regenerate the whole site," it will write a
fresh HTML file from scratch and all of today's fixes disappear:
- saved stars breaking every time notes are added
- the broken light/dark toggle
- offline support, the Tools grid, multi-word search, note TOCs, etc.

With the split, the app code is frozen and only your data flows through.

## One more thing for your phone

If IM Toolkit is already on your Home Screen, remove it and re-add it once
after uploading — that picks up the new app icon and true offline mode.
