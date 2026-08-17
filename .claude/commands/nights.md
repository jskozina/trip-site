---
description: Change how many nights in a place, cascading every later date
---

Change the length of stay: $ARGUMENTS

1. Find the leg in `trip.json` by name (fuzzy match is fine).
2. Set its `end` so the nights match what was asked.
3. **Cascade**: shift the `start` and `end` of every leg and transit *after* it by the same number of days, so there are no gaps or overlaps. This is the whole point of the command — never leave the dates broken.
4. Update any `stay` entries inside the changed leg and every later leg so their dates stay inside their parent leg. If a stay no longer fits, shorten it and say so.
5. Check the trip still ends on the return date in `trip.return`. If it doesn't, say clearly by how much it has moved and ask whether to absorb the difference somewhere or shift the flight home.
6. Report back as a plain list of the new dates, city by city. No JSON.
