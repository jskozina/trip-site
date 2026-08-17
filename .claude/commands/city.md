---
description: Add, remove, or reorder a city and fix all the dates around it
---

Restructure the trip: $ARGUMENTS

Examples of what this handles: "add 2 nights in Kanazawa between Kyoto and Nozawa", "drop Hoi An", "swap Hanoi for Da Nang", "move Tokyo to the end".

1. Make the change to the `legs` array, keeping it chronological.
2. **Rebuild every date from the start** so the whole trip is continuous: no gaps, no overlaps, first leg starting on `trip.depart`.
3. **Add or remove the transit rows either side.** A new city needs a transit in and a transit out, and removing one means merging two transits into a single leg. Look up realistic travel times and modes rather than leaving them blank — use train times for Japan, flights for anything crossing a border.
4. Set `climate` on any new leg honestly for late December or early January.
5. Move or delete any orphaned stays and spots, and say what happened to them.
6. If the trip no longer ends on `trip.return`, say by how much and ask what to absorb.
7. Report the new city-by-city list with dates and nights. No JSON.
