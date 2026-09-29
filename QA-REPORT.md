# StyledByKeana: QA report (28 Sep 2026)

Served locally with a test server that enforces the exact Content-Security-Policy from `netlify.toml`, driven by Playwright (Chromium).

| Check | Result |
| --- | --- |
| Visual review, 390x844 and 1440x900, every page, viewport by viewport after motion settles | Reviewed and iterated (hero scale, split-word descenders, lazy images inside closed apertures, mobile search bar overflow, gallery label sizing, 320px belief cards, footer hours, spacing) |
| Console errors / page errors (CSP enforced), 6 pages x 320/390/1440 | 0 |
| Horizontal overflow at 320 and 390 | None (document scrollWidth equals viewport on every page) |
| Internal links, anchors, fragment links, `src`/`srcset`/`imagesrcset`, CSS `url()` | All resolve |
| JSON-LD blocks (HairSalon with full offer catalog, WebSite, BreadcrumbList, FAQPage, Person) | 13 blocks, all parse; no aggregateRating/Review markup |
| One `<h1>` per page | Pass (6/6) |
| Every `<img>` has alt, width, height | Pass |
| Titles 60 chars or fewer, descriptions 158 or fewer | Pass (titles 30 to 59, descriptions 83 to 157) |
| Emoji scan over all HTML/CSS/JS/TXT/MD/TOML/XML/SVG | None found |
| Reduced motion emulation | No hidden content, no clip-path left closed, Lenis not started, no scrub |
| JavaScript disabled | Hero and all sections visible; header solid; menu toggle hidden (footer and action bar keep navigation) |
| Mobile menu | Opens, focus moves in, Tab is trapped, Escape closes and returns focus to the toggle |
| Gallery | Filters update the count; lightbox opens on the tapped photo, arrow keys page, Tab stays in the dialog, Escape closes and returns focus |
| Services | Search filters items and groups with a live status message and an empty state; category chips scroll to the group below the sticky bar and highlight while scrolling |
| Tap targets at 390 | All 44px or larger, except two inline text links inside the Quick facts list (inline links are exempt under WCAG 2.5.8) |
| Contrast (WCAG AA) | Cream on plum 17.4:1, muted text 8.9:1, lavender tint 9.9:1, purple button with dark text 5.1:1, plum on lilac 6.8:1 |
| LCP / CLS, cold load, 390px, 1.6 Mbps + 150 ms latency + 4x CPU throttle | Home LCP about 1.5 s, CLS 0.001. The LCP image is never hidden by motion (on-screen halos only draw their ring) |

Not run: an official Lighthouse report (no Lighthouse binary or network access in the build environment). Run it after deploying to Netlify.
