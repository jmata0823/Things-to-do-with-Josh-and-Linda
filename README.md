# Things to do with Josh and Linda

A simple static website: a running list of restaurants and entertainment spots,
each with a Yelp/Google Maps link and a pin on an interactive map. Built with
plain HTML/CSS/JS and [Leaflet](https://leafletjs.com/) + OpenStreetMap (free,
no API key needed).

- Restaurants show up as honeypot markers on the map; entertainment spots show up as bear markers.
- Clicking "View on Google Maps" opens an embedded map right on the page. Clicking "View on Yelp" opens a modal with the place's info and a link out — Yelp doesn't allow other sites to embed its pages directly, so a full new-tab visit is unavoidable there.

## Files

- `index.html` — page structure, tabs, the "Add a place" form, and the modal markup
- `style.css` — styling
- `app.js` — renders the list/map, filters by category, runs the add-place form and modals
- `data.js` — **the permanent list of places**
- `_serve.ps1` — optional local preview server (not needed for GitHub Pages, not committed to the repo)

## Adding a place

Click **+ Add a place** on the site itself. Fill in the name, category, address,
description, and Yelp/Google links, then click **Find coordinates from address**
to auto-fill latitude/longitude (or enter them manually — right-click a spot on
Google Maps and click the coordinates shown at the top of the menu). Submitting
the form:

- Shows the new place immediately on your map/list for this visit.
- Gives you a ready-made code snippet to make it permanent.

To publish it for both of you: paste that snippet into `data.js`'s `PLACES`
array yourself and push, or just send the snippet to Claude in chat and ask
it to add it — either way it becomes permanent and shows up for both of you
once it's committed.

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
