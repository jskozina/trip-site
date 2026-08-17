---
description: Add a hotel or a place, from a URL or just a name
---

Add this: $ARGUMENTS

1. If it's a URL, fetch it and pull out the name, coordinates, and a short description.
   - Google Maps short links: follow the redirect, read `!3d{lat}!4d{lng}` from the expanded URL.
   - Airbnb and Booking.com block scrapers. Take the title, leave the rest blank rather than guessing.
   - If the fetch fails, say so and add it with just a name and the URL.
2. Decide whether it's a `stay` or a `spot`. Accommodation is a stay, everything else is a spot.
3. Work out which leg it belongs to by comparing coordinates to each leg's `lat`/`lng` and taking the nearest. If there are no coordinates and it isn't obvious from the name, ask.
4. Write a `body` in the house style: plain and specific, including the downside if there is one. Two sentences maximum.
5. Set `status: "idea"` unless told otherwise.
6. Confirm in one line what you added and where. No JSON.

If it's a hotel and you can find a rough nightly rate, put it in `priceAud` as a whole number and say it's an estimate.
