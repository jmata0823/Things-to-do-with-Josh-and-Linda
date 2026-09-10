# Things to do with Josh and Linda

A simple static website: a running list of restaurants and entertainment spots,
each with a Yelp/Google Maps link and a pin on an interactive map. Built with
plain HTML/CSS/JS and [Leaflet](https://leafletjs.com/) + OpenStreetMap (free,
no API key needed).

## Files

- `index.html` — page structure and tabs (All / Restaurants / Entertainment)
- `style.css` — styling
- `app.js` — renders the list, filters by category, draws map markers
- `data.js` — **the list of places** — this is the only file you'll usually edit
- `_serve.ps1` — optional local preview server (not needed for GitHub Pages)

## Adding a place

Open `data.js` and add an entry to the `PLACES` array:

```js
{
  name: "Place Name",
  category: "restaurants",   // or "entertainment"
  address: "123 Main St, Las Vegas, NV",
  lat: 36.1699,
  lng: -115.1398,
  description: "One or two sentences about it.",
  yelpUrl: "https://www.yelp.com/biz/...",
  googleUrl: "https://www.google.com/maps/place/..."
}
```

To get `lat`/`lng`: open the place in Google Maps, right-click its pin, and
click the coordinates shown at the top of the menu to copy them.

## Preview locally before publishing (optional)

Double-clicking `index.html` works in most browsers. If your browser blocks
local scripts, run the included mini server instead:

```powershell
powershell -File "_serve.ps1"
```

Then open `http://localhost:5500/` in a browser. Press Ctrl+C in the terminal
to stop it when done.

## Publish to GitHub Pages (no git installation needed)

1. Go to [github.com](https://github.com) and sign in (create a free account if needed).
2. Click **New repository**. Name it something like `things-to-do-with-josh-and-linda`,
   set it to **Public**, and click **Create repository** (leave "Add a README" unchecked).
3. On the new repo's page, click **uploading an existing file**.
4. Drag in `index.html`, `style.css`, `app.js`, `data.js`, and `README.md` from
   this folder (you can skip `_serve.ps1`, it's just a local preview helper).
5. Scroll down and click **Commit changes**.
6. Go to the repo's **Settings** tab → **Pages** (left sidebar).
7. Under "Build and deployment", set **Source** to "Deploy from a branch",
   **Branch** to `main` and folder to `/ (root)`, then **Save**.
8. Wait about a minute, then refresh the Pages settings screen — it will show
   your live URL: `https://<your-username>.github.io/things-to-do-with-josh-and-linda/`

## Updating the site later

Edit `data.js` locally, then on GitHub go to the file, click the pencil (edit)
icon, paste in the new contents, and commit. GitHub Pages redeploys automatically
within a minute or two.

If you'd rather use git properly later, install it from
[git-scm.com](https://git-scm.com/download/win) and the GitHub CLI from
[cli.github.com](https://cli.github.com/) — then `git clone` the repo and
push changes from the command line instead of editing in the browser.
