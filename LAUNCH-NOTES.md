# StyledByKeana: launch notes

Everything below needs Keana's confirmation or action before this site goes live. Facts on the site come only from her Booksy page, Google Business Profile and Instagram, checked 28 Sep 2026.

## 1. The dead domain (the pitch)
- Keana's Booksy "Website" button links to `https://styledbykeana.com/`, which does not resolve (DNS fails). Every client who taps it today gets an error.
- Action: re-register or renew `styledbykeana.com`, point it at this site (Netlify), then swap the canonical base from `https://styledbykeana.netlify.app/` to `https://styledbykeana.com/` (see README).
- Also update the Google Business Profile website field (currently a Booksy link) and the Instagram bio link if she wants the site to be the front door.

## 2. Conflicts found in research
- **Hours (Tuesday):** Google shows Tuesday open 11 AM to 7 PM; Booksy says Tuesday closed. The site uses Booksy (Wed to Fri 11 to 7, Sat 12 to 6, Sun to Tue closed). Fix Google Business Profile hours, or tell us the correct hours.
- **Review counts:** Google shows 5.0 from 33 reviews; Booksy shows 4.9 from 190 (186 five-star). Both are shown as text with the date checked. Consider asking Booksy clients to also review on Google to close the gap.
- **Some upcoming Saturdays are blocked on Booksy.** The site says so and sends people to Booksy for live availability.

## 3. Confirm with Keana
- Use of the nickname **"Keke"** on the site (Home and About say clients also call her Keke, alongside the Keke Loves the Kids menu name).
- Her full name **Keana Anjelica Mary** as displayed.
- **"Black-owned, women-owned, LGBTQ+ friendly"** (from Google attributes) shown in the proof strip and footer.
- Amenities from Booksy: parking, accessible, child-friendly, Wi-Fi. Any parking details (lot, street, validation) she wants added.
- All prices and durations (copied from Booksy with "+" starting prices). Add-on prices (steam therapy $25, scalp detox & massage $20, trim $45, hair fragrance finish $10, beads & accessories varies) were listed without "+"; confirm. Note the add-on trim ($45) and the maintenance trim ($40+) are both on the menu.
- The About, Mission, Vision and Core Beliefs text is her own wording, lightly punctuated for the web (em dashes turned into commas or colons in a few places). Meaning unchanged.
- The description on each Singles & Knotless line reads "Box or knotless." based on the Booksy category name "Singles & Twist (box & knotless)".
- Whether she wants a phone number shown for calls (415) 997-9107, or text-only.

## 4. Photo approvals
- All 26 gallery photos and the service imagery are from her Booksy/Instagram portfolio and show real clients. Get Keana's confirmation that each client has agreed to appear on a website, especially photos where a face is visible: boho knotless with honey curls (client in glasses), Fulani with gold cuffs, Fulani profile, twists with curled ends (smiling client in glasses), curly highlights.
- Keana's portrait (`keana-portrait`) is used on Home and About. Ask if she has a preferred or more recent photo.
- Photos deliberately **not** used (and removed from the deploy folder so they are never published): the neon "The Salon @ Skyline" sign photo (the name is not verified as hers and is not claimed anywhere on the site), a Fulani photo and a passion-twists photo where the client may be a minor, the raw logo source file, and a near-duplicate boho braids shot.
- Better originals: several portfolio images are phone photos at 843 to 1170 px. Higher-resolution originals would sharpen the gallery lightbox.

## 5. Placeholder / generated items
- `assets/img/share.jpg` (social preview) and the favicon set (a Bodoni "K" inside a purple and gold ring) were generated for this concept.
- Canonical URLs use the preview address `https://styledbykeana.netlify.app/` until her domain is connected.
- No booking form: booking stays on Booksy, which is her live system today.

## 6. Nice-to-haves after launch
- Add Google review count updates periodically (both counts are dated on the site).
- Connect Google Business Profile "Book" button to the same Booksy link.
