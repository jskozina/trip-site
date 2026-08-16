# Trip site

A static itinerary site. Two files, no build step.

## Files

- `trip.json` — the data. Edit this to change the itinerary.
- `index.html` — renders `trip.json`. Open it directly in a browser, or serve the folder.
- `inbox.md` — paste URLs here (one per line, optional `| note`), then ask Claude Code to "process the inbox" to turn them into itinerary entries.

## Local preview

No build step needed. Either open `index.html` directly in a browser, or serve the folder so relative fetches work cleanly:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying

Push to `main` and Netlify deploys automatically. No build command, no publish directory beyond the repo root — it's static.

## Editing conventions

See `CLAUDE.md` for the `trip.json` schema and field rules.
