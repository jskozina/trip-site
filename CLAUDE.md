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
- `index.html` — self-contained frontend. No build step. Dependencies are Google Fonts and Leaflet (the route map), both loaded from a CDN — no package.json, no bundler.
- `inbox.md` — raw captured URLs waiting to be processed.
- `README.md` — setup notes for the human.

## Schema

```
trip: { title, depart, return, travellers, homeTz, budget }
legs: [ leg | transit ]
```

**leg** (a place you sleep)
`id, type:"leg", title, climate, start, end, lat, lng, tz, image, images[], body, stays[], spots[]`

**transit** (a movement between legs)
`id, type:"transit", title, mode, duration, flightNo, from, to, departTime, arriveTime, start, end, priceAud, body, status, group`

**stay** (inside a leg)
`id, title, subtitle, start, end, lat, lng, priceAud, url, image, body, status`

**spot** (inside a leg — eat, see, do)
`id, title, category, lat, lng, url, priceAud, image, body, status`

### Field rules

- `climate` is one of `cold | cool | temperate | warm | hot`. It's not shown on the site at all any more (an earlier icon treatment for it didn't land well) — keep it in the data anyway, honestly set for the season, in case it's useful later.
- `status` is one of `idea | shortlist | held | booked`. This is the main colour-coded signal on the site — each has its own colour, icon, and label (grey/idea, blue/shortlist, amber/held, green/booked) — so keep it accurate, it's what the human actually reads at a glance. Default new items to `idea`.
- `priceAud` on a **stay** is per night, a whole number, no currency symbol — the site multiplies by nights. On a **transit** or **spot** it's a flat one-off cost (a flight fare, a ticket, a meal) — no multiplying.
- `departTime`/`arriveTime` on a **transit** are optional 24-hour `HH:MM` local times. When both are set, the transit row shows a big departures-board-style readout. Only set these from a real timetable or booking, never guess a time.
- `from`/`to` on a **transit** are optional IATA airport codes (`BNE`, `TPE`) shown alongside the time readout. Flights only — leave off for trains, cars, ferries.
- `flightNo` on a **transit** is optional (e.g. `"EVA Air 316"`, `"VietJet 83"`). Only set it when you actually have it — a real booking or a search result, never invented. Skip it for anything that isn't a flight, and don't add other flight trivia (aircraft type, seat config) — it's noise the human didn't ask for.
- `group` on a **transit** is optional. Give two or more *consecutive* transit entries the same `group` string and the site renders them as one visually linked card (a connecting flight, or a flight followed by a road transfer) instead of separate ones, with a layover/transfer connector between them. The string itself is shown as the card's label, so write it as a short human caption, e.g. `"Connecting via Taipei"`. Use this — rather than cramming a multi-leg journey into one transit's `body` — whenever a single booking or journey actually involves more than one distinct movement (a stopover, a flight-then-car transfer). Each segment keeps its own `id`, times, and `status`.
- `id` is a short kebab-case slug, unique across the whole file.
- Dates are `YYYY-MM-DD`. Legs render in array order, so keep the array chronological.
- `lat`/`lng` are optional on a leg, stay, or spot — without them, the Map link falls back to a text search of the title. On a **leg** they also place its marker on the route map, so set them for anything that should appear there.
- `category` on a spot is a short label like `Eat`, `See`, `Shop`, `Drink`. A spot categorised `Eat` counts toward the Food budget line; anything else counts toward Activities.
- `image` is optional on a leg, stay, or spot — a direct URL to a photo. Without one, the site shows a colour block instead, so it's safe to leave blank. The site crops it consistently on its own, so any aspect ratio works — an Unsplash link is a good default.
- `images` is optional on a **leg** only — an array of photo URLs. The calendar cycles through them one per day of that city's stay (day 1 gets `images[0]`, day 2 gets `images[1]`, wrapping around), so the "at a glance" view shows real variety instead of one photo repeated every night. Falls back to the single `image` if `images` isn't set. Keep `image` as `images[0]` so the hero and the first calendar day match.
- `trip.budget` is optional: `{ flights, accom, food, activities }`, each a whole-trip AUD target. Omit a category, or the whole object, if no target's been set yet — the budget section still shows what's actually been committed so far, it just won't have a target line to compare against. Set these when the human gives you a number, e.g. "budget $6000 for flights".

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
