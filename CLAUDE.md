# Trip site

A static itinerary site. `trip.json` is the data, `index.html` renders it, Netlify deploys on push to `main`.

## How the human works

**They never write or read JSON. That's your job.**

They will say things like "make Kyoto five nights", "we booked the Park Hyatt", "add this Airbnb", "what's it costing so far". Take that, make the edit, and reply in plain English: what changed, what it means for the dates, what it costs now.

Rules for every response:

- **Never show JSON** unless they explicitly ask to see the file.
- **Never ask them to edit a file.** If something needs changing, change it.
- **Always cascade dates.** Changing the length of one stay shifts everything after it. Do that automatically, don't ask permission, and report the new dates. Leaving the trip with gaps or overlaps is a bug.
- **Say when something breaks.** If a change pushes the trip past the return flight, or leaves a night with nowhere to sleep, lead with that.
- **Commit after each change** with a plain-English message. Don't ask whether to commit.
- **Confirm briefly.** Two or three lines. They're often on a phone.

There are slash commands in `.claude/commands` for the common jobs: `/add`, `/nights`, `/city`, `/book`, `/check`. Plain English without a command should work identically.

## Files

- `trip.json` — the only source of truth. Never duplicate data into the HTML.
- `index.html` — self-contained frontend. No build step, no dependencies except Google Fonts.
- `inbox.md` — raw captured URLs waiting to be processed.
- `README.md` — setup notes for the human.

## Schema

```
trip: { title, subtitle, depart, return, travellers, homeTz }
legs: [ leg | transit ]
```

**leg** (a place you sleep)
`id, type:"leg", title, climate, start, end, lat, lng, tz, image, body, stays[], spots[]`

**transit** (a movement between legs)
`id, type:"transit", title, mode, duration, start, end, body, status`

**stay** (inside a leg)
`id, title, subtitle, start, end, lat, lng, priceAud, url, image, body, status`

**spot** (inside a leg — eat, see, do)
`id, title, category, lat, lng, url, image, body, status`

### Field rules

- `climate` is one of `cold | cool | temperate | warm | hot`. It drives the accent colour on that leg's card, which shifts from frost blue in Japan to lacquer red in Saigon. Set it honestly for the season.
- `status` is one of `idea | shortlist | held | booked`. Default new items to `idea`.
- `priceAud` is per night, a whole number, no currency symbol. The site multiplies by nights.
- `id` is a short kebab-case slug, unique across the whole file.
- Dates are `YYYY-MM-DD`. Legs render in array order, so keep the array chronological.
- `lat`/`lng` are optional. Without them, the Map link falls back to a text search of the title.
- `category` on a spot is a short label like `Eat`, `See`, `Shop`, `Drink`.
- `image` is optional on a leg, stay, or spot — a direct URL to a photo. Without one, the site shows a colour block instead, so it's safe to leave blank.

## Processing the inbox

When asked to "process the inbox":

1. Read `inbox.md`. Each non-empty line is a URL, optionally followed by a note after a `|`.
2. For each URL, fetch it and extract: name, coordinates if present, a one-line description.
   - **Google Maps** short links: follow the redirect and read the expanded URL. Coordinates sit in the `!3d{lat}!4d{lng}` pattern. This is the most reliable source.
   - **Airbnb / Booking.com**: they block scrapers aggressively. Expect the title and little else. Take what you can get and leave the rest blank rather than guessing.
   - If a fetch fails entirely, leave the line in `inbox.md` and say so. Never invent details.
3. Work out which leg it belongs to by comparing its coordinates to each leg's `lat`/`lng` and taking the nearest. If there are no coordinates, ask.
4. Decide `stay` vs `spot` from the source: accommodation sites are stays, everything else is a spot.
5. Write it into the right array in `trip.json` with `status: "idea"`.
6. Remove processed lines from `inbox.md`.
7. Commit with a message naming what was added.

## Writing style for `body` fields

Match the existing entries. Plain, specific, useful. Say what's actually true about a place including the downsides — grey weather, closures, a long walk uphill in the snow. No marketing language, no "nestled", no "vibrant". Australian English. Avoid em dashes; use commas or full stops.

Keep `body` to one or two sentences on a spot, two or three on a stay or leg.

## Things not to do

- Don't add a build step, a framework, or a package.json. The whole point is that it's two files.
- Don't put secrets in the repo. It's a public Netlify site.
- Don't reformat `trip.json` wholesale in a way that makes the diff unreadable. Two-space indent, keys in the order above.
- Don't change `index.html` when the task is a data change.
