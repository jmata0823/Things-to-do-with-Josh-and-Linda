# Things to do with Josh and Linda

A simple static website: a running list of restaurants, cafes, and entertainment
spots, each with a Google Maps link and a pin on an interactive map. Built with
plain HTML/CSS/JS and [Leaflet](https://leafletjs.com/) + OpenStreetMap (free,
no API key needed).

- Restaurants show up as honeypot markers on the map; cafes show up as mug markers; entertainment spots show up as bear markers.
- Clicking "View on Google Maps" opens an embedded map right on the page, no new tab.
- Checking "We've been here" on a place marks it visited (permanently, shared) and adds a checkmark badge to its map icon.

## Files

- `index.html` — page structure, tabs, the "Add a place" form, and the modal markup
- `style.css` — styling
- `app.js` — renders the list/map, filters by category, runs the add-place form and modals
- `data.js` — the original curated list of places (edited by hand + git, same as always)
- `firebase-config.js` — public Firebase project config (not secret — see "Shared database" below)
- `_serve.ps1` — optional local preview server (not needed for GitHub Pages, not committed to the repo)

## Adding a place

Click **+ Add a place** on the site itself. Fill in the name, category, address,
description, and Google Maps link, then click **Find coordinates from address**
to auto-fill latitude/longitude (or enter them manually — right-click a spot on
Google Maps and click the coordinates shown at the top of the menu). Submitting
the form saves it permanently and immediately — it shows up for both of you,
on any device, with no extra steps.

## Editing or deleting a place

Places added through the form (anything with **Edit**/**Delete** links under
its Google Maps link) can be edited or deleted right on the site — click
**Edit** to reopen the form pre-filled with its details, or **Delete** to
remove it (asks for confirmation first; this can't be undone).

The two original curated places (Lotus of Siam, Fremont Street Experience)
live in `data.js` instead, so they don't show Edit/Delete — ask in chat to
change those, or edit `data.js` directly and push.

## Shared database (Firestore)

Places added through the form are stored in a free Firebase/Firestore
database (project `linda-and-joshua`), separate from the hand-curated list in
`data.js`. The site loads both and shows them together. `firebase-config.js`
holds the project's public config — these values identify the project but
don't grant access on their own; access is controlled by the security rules
set in the Firebase console (Firestore Database → Rules), which allow anyone
to read the list and to add, edit, or delete an entry as long as it's
well-formed (there's no login system, so this trust model only makes sense
for a small shared list like this one).

## Preview locally before publishing (optional)

Double-clicking `index.html` works in most browsers. If your browser blocks
local scripts, run the included mini server instead:

```powershell
powershell -File "_serve.ps1"
```

Then open `http://localhost:5500/` in a browser. Press Ctrl+C in the terminal
to stop it when done.

## Publishing changes

This repo is git-tracked. From the project folder:

```powershell
git add -A
git commit -m "Describe the change"
git push
```

The first push from a new machine will prompt a browser sign-in to authorize
git to push on your behalf.

GitHub Pages' CDN can keep serving a cached, older copy of `style.css`/`app.js`/
`data.js` for a few minutes after a push, even past a hard refresh. To make
sure changes to those files show up immediately, bump the `?v=` query string
on their `<script>`/`<link>` tags in `index.html` (e.g. `style.css?v=20260917a`
→ `style.css?v=20260917b`) whenever you edit one of them — that forces
browsers and GitHub's CDN to treat it as a brand-new file.
