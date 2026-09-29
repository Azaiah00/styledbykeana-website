# StyledByKeana: spec website

A launch-ready static website for **StyledByKeana** (Keana Anjelica Mary, Natural Hair Artistry), 1518 San Pablo Avenue, Suite 3, Berkeley, CA 94702. Built as a spec concept by Couture House Co. (hello@couturehouse.co).

Keana's Booksy "Website" button currently points to `styledbykeana.com`, which does not resolve. This site is built to live on that exact domain.

## Pages
| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, ratings, signature services, ring-light portfolio band, Meet Keana, mission, reviews, how booking works, FAQ, visit + quick facts |
| `services.html` | Full Booksy menu (13 groups), sticky category chips, live search, price note, policies |
| `gallery.html` | 26 portfolio photos, 5 style filters, accessible lightbox |
| `about.html` | About, mission, vision, core beliefs, the suite and amenities |
| `book.html` | Booking steps, policies and etiquette in full, add-ons, hours, directions, booking FAQ |
| `404.html` | Branded not-found page |

Primary call to action on every page: **Book on Booksy** (`https://booksy.com/en-us/240113_styledbykeana_hair-salon_119583_berkeley`). Mobile visitors get a sticky bar with Book, Services and Call.

## Stack
- Static HTML, one stylesheet (`assets/css/site.css`), one script (`assets/js/site.js`). No build step, no external requests.
- Fonts self-hosted in `assets/fonts/`: Bodoni Moda (display) and Plus Jakarta Sans (UI/body).
- Motion: vendored GSAP 3.15 (ScrollTrigger, SplitText, DrawSVGPlugin) and Lenis 1.3 in `assets/vendor/`.
- Signature motion, "The Halo": images open through a circular aperture while a glowing purple ring draws itself around them, echoing the ring light Keana shoots every finished look through. The hero ring turns and grows as you scroll. Every effect switches off under `prefers-reduced-motion`, and all content is visible without JavaScript.
- SEO: unique titles and descriptions, canonical URLs, Open Graph/Twitter card (`assets/img/share.jpg`), JSON-LD (`HairSalon` with the full offer catalog, `WebSite`, `BreadcrumbList`, `FAQPage`, `Person`), `sitemap.xml`, `robots.txt` (AI crawlers allowed) and `llms.txt` fact sheet.
- Security: `netlify.toml` sets a strict CSP (`default-src 'self'`; the one inline script is allowed by its SHA-256 hash), plus HSTS, frame, referrer and permissions headers.

## Preview locally
```bash
cd styledbykeana
python3 -m http.server 8000     # then open http://localhost:8000
# or
npx serve .
```

## Deploy (Netlify drag-and-drop)
1. Go to https://app.netlify.com/drop and drag this folder in.
2. Rename the site to `styledbykeana` so the preview lives at `https://styledbykeana.netlify.app/` (the address the canonical tags already use).

## Connect Keana's own domain (styledbykeana.com)
1. Re-register or renew `styledbykeana.com`, then add it in Netlify under Domain management and follow the DNS steps.
2. Find and replace `https://styledbykeana.netlify.app/` with `https://styledbykeana.com/` across every `.html` file, `sitemap.xml`, `robots.txt` and `llms.txt`.
3. Confirm the Booksy "Website" button, Instagram link and Google Business Profile website field point to the new domain.

## Editing notes
- Prices, times and policies are copied from Booksy on 28 Sep 2026. Update `services.html`, the JSON-LD block in `index.html`, `services.html` and `book.html`, and `llms.txt` together when prices change.
- Hours appear in the visit block, footer, book page, JSON-LD and `llms.txt`.
- The `.js` class on `<html>` is added by a tiny inline script. If you change that script, recompute its SHA-256 hash in the CSP in `netlify.toml`.
- See `LAUNCH-NOTES.md` for everything to confirm with Keana before launch.
