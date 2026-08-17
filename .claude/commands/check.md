---
description: Sanity check dates, gaps, costs and anything obviously broken
---

Check `trip.json` and report problems. Don't fix anything unless asked.

Check for:

1. **Date gaps or overlaps** between consecutive legs. Every leg's `start` should equal the previous one's `end`.
2. **Trip boundaries**: does the first leg start on `trip.depart` and the last finish on `trip.return`?
3. **Stays outside their leg**: a stay whose dates fall outside its parent leg's dates.
4. **Uncovered nights**: a leg with no stay, or nights within a leg no stay covers.
5. **Duplicate `id` values** anywhere in the file.
6. **Missing coordinates** on anything that should have them.
7. **Travel time sanity**: a transit whose `start` and `end` don't line up with the legs either side.

Then report:

- Nights per city and the total
- Accommodation cost, split into booked, held, and estimated
- How many nights still have nowhere to sleep

Write it as a short plain list. No JSON, no tables unless there are more than six problems.
