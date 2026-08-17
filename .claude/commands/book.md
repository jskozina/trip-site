---
description: Mark something shortlisted, held, or booked
---

Update the booking status: $ARGUMENTS

1. Find the stay or spot by name in `trip.json`.
2. Set `status` to whichever of `idea`, `shortlist`, `held`, `booked` was asked for. If it just says "booked" or "I booked it", use `booked`.
3. If a price was mentioned, update `priceAud` to the actual figure and note in the `body` that it's confirmed rather than an estimate.
4. If a booking reference was mentioned, append it to the `body` at the end.
5. When something becomes `booked`, check whether any other stay in the same leg covers the same nights. If so, flag the clash and ask whether to remove the other one.
6. Report the new accommodation total across everything booked, and separately the total including shortlisted items.
